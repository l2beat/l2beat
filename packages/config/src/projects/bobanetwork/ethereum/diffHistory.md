Generated with discovered.json: 0x0703ed16f77094f727afcefac33536a9c5f094a0

# Diff at Tue, 04 Mar 2025 11:25:30 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21428646
- current block number: 21428646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x22a6ece818d73e1c213199761008144d8e1943ad

# Diff at Tue, 04 Mar 2025 10:39:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21428646
- current block number: 21428646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19478405
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19478401
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      sinceBlock:
+        19243663
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        13011949
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      sinceBlock:
+        19478397
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19478400
    }
```

```diff
    contract AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        13011797
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19478398
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19478402
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19478399
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        13012048
    }
```

Generated with discovered.json: 0x628a60be6e288a5390635dc122c1dfc96a7bed64

# Diff at Thu, 27 Feb 2025 11:45:28 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21428646
- current block number: 21428646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "Lib_AddressManager"
+        "AddressManager"
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0xd2b3dc67e9bf1d40c72401fd56fb92b7c9e946d2

# Diff at Wed, 26 Feb 2025 10:32:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21428646
- current block number: 21428646

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x1eabde18cdb796c6078f152f6df04e9cfcbbb71d

# Diff at Fri, 21 Feb 2025 14:05:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21428646
- current block number: 21428646

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xf3f49c4bd3f7ba6168ef20ccf362f557acef627f

# Diff at Fri, 21 Feb 2025 08:59:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21428646
- current block number: 21428646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x06ce8a6c51bd017dc7b0d6acc2418abfdbd83511

# Diff at Mon, 10 Feb 2025 19:03:45 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21428646
- current block number: 21428646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x975a63575b9c0c9b6f31564047be02448c7a1a94

# Diff at Tue, 04 Feb 2025 12:30:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21428646
- current block number: 21428646

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
+        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      receivedPermissions.4.description:
+        "set and change address mappings."
      receivedPermissions.4.via:
+        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "guard"
      receivedPermissions.2.from:
-        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.via:
-        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xc989acf3ba243b8f624ed98c345ea77aa2af6ec5

# Diff at Mon, 20 Jan 2025 11:09:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21428646
- current block number: 21428646

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.1.target:
-        "0xe1B64045351B0B6e9821F19b39f81bc4711D2230"
      issuedPermissions.1.to:
+        "0xe1B64045351B0B6e9821F19b39f81bc4711D2230"
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
      receivedPermissions.11.from:
+        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
      receivedPermissions.10.target:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      receivedPermissions.10.from:
+        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      receivedPermissions.9.target:
-        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
      receivedPermissions.9.from:
+        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
      receivedPermissions.8.target:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.8.from:
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.7.target:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.7.from:
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.6.target:
-        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
      receivedPermissions.6.from:
+        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
      receivedPermissions.5.target:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.5.from:
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.4.target:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.4.from:
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.3.target:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.3.from:
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.2.target:
-        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      receivedPermissions.2.from:
+        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      receivedPermissions.1.target:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.1.from:
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.0.target:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      receivedPermissions.0.from:
+        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      directlyReceivedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
      directlyReceivedPermissions.0.from:
+        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
      directlyReceivedPermissions.7.from:
+        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
      directlyReceivedPermissions.6.target:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      directlyReceivedPermissions.6.from:
+        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      directlyReceivedPermissions.5.target:
-        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
      directlyReceivedPermissions.5.from:
+        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
      directlyReceivedPermissions.4.target:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      directlyReceivedPermissions.4.from:
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      directlyReceivedPermissions.3.target:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      directlyReceivedPermissions.3.from:
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      directlyReceivedPermissions.2.target:
-        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
      directlyReceivedPermissions.2.from:
+        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
      directlyReceivedPermissions.1.target:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      directlyReceivedPermissions.1.from:
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      directlyReceivedPermissions.0.target:
-        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      directlyReceivedPermissions.0.from:
+        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.1.target:
-        "0xbfBAB4363034A930687B9320599a69DfBf1D21d0"
      issuedPermissions.1.to:
+        "0xbfBAB4363034A930687B9320599a69DfBf1D21d0"
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xdd2edcc5527ce5186ae888579067d386f7b6aaac

# Diff at Wed, 08 Jan 2025 08:59:31 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21428646
- current block number: 21428646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428646 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x8d063efb8aca257b5f302697e4e4618982c8c3a5

# Diff at Wed, 18 Dec 2024 10:01:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 20919938
- current block number: 21428646

## Description

SystemConfig upgrade to version `2.3.0-beta.5`, which is a post-faultproofs version. But since the DisputeGameFactory address is not set and OptimismPortal is still on an old version, this has no consequence on the state validation logic.

## Watched changes

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xe8f575933bc08fd1b1839c74e98447d0a629845c07c4281981ee0ba86ce88298"
      values.$implementation:
-        "0xfaE274B77BA59f001196689f93E9e73693866f4a"
+        "0xb52F8f5D1285e3bc13F9C53D27C6F7336a3B50A9"
      values.$pastUpgrades.1:
+        ["2024-12-16T17:58:59.000Z","0x2dd4983dfade963b3da262a0c56b5085ffc5ee2f3046292326568738250b5a42",["0xb52F8f5D1285e3bc13F9C53D27C6F7336a3B50A9"]]
      values.$upgradeCount:
-        1
+        2
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      values.version:
-        "1.12.0"
+        "2.3.0-beta.5"
      values.basefeeScalar:
+        500000
      values.blobbasefeeScalar:
+        1014213
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0x0000000000000000000000000000000000000000"
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.maximumGasLimit:
+        200000000
    }
```

## Source code changes

```diff
.../SystemConfig/SystemConfig.sol                  | 1502 +++++++++++++++++++-
 1 file changed, 1462 insertions(+), 40 deletions(-)
```

Generated with discovered.json: 0x8724b65dcee24112f0c4a946b885a8647360af24

# Diff at Fri, 01 Nov 2024 12:23:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      receivedPermissions.11.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      directlyReceivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xc3645523041c27406656aa5f0465a9102c434d18

# Diff at Tue, 29 Oct 2024 13:05:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xce82bc83aef0218f632f53cc3b935f60278414f4

# Diff at Tue, 22 Oct 2024 13:49:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xe23e363de69df878ca5912adc0cccde5ed1ae98a

# Diff at Mon, 21 Oct 2024 12:43:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0xc59f1430d53994bcea353173264b6d8d200aaf96

# Diff at Mon, 21 Oct 2024 11:04:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xfaE274B77BA59f001196689f93E9e73693866f4a"]
      values.$pastUpgrades.0.1:
-        ["0xfaE274B77BA59f001196689f93E9e73693866f4a"]
+        "0x41b524b2ed6de3f6ec58d8e6508f9f6055ca3cb28a80b98af3213eb285a9fdce"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xd080A33E651780cD6f52F16020E1FFA04F0f15B2"]
      values.$pastUpgrades.0.1:
-        ["0xd080A33E651780cD6f52F16020E1FFA04F0f15B2"]
+        "0x1361f48fea8fbc08ffbc0877f540635a35dffe6560829923443c70702232197d"
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.4.2:
+        ["0x3b48597212f2622511585914CC4D4152c9B1B077"]
      values.$pastUpgrades.4.1:
-        ["0x3b48597212f2622511585914CC4D4152c9B1B077"]
+        "0x1361f48fea8fbc08ffbc0877f540635a35dffe6560829923443c70702232197d"
      values.$pastUpgrades.3.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.3.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x41b524b2ed6de3f6ec58d8e6508f9f6055ca3cb28a80b98af3213eb285a9fdce"
      values.$pastUpgrades.2.2:
+        ["0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820"]
      values.$pastUpgrades.2.1:
-        ["0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820"]
+        "0xa7c1696ee1da04699ec29609eb9c645e327a590ad21ff4a8cf16a9671719bec9"
      values.$pastUpgrades.1.2:
+        ["0xae6b041f0550EDeF61a70F76f89c77B2b1Ef38Fd"]
      values.$pastUpgrades.1.1:
-        ["0xae6b041f0550EDeF61a70F76f89c77B2b1Ef38Fd"]
+        "0x9ba695c4025241f04617877232a4cf86d9ccc1783a693cfe661784c7f89c8050"
      values.$pastUpgrades.0.2:
+        ["0x25109139f8C4F9f7b4E4d5452A067feaE3a537F3"]
      values.$pastUpgrades.0.1:
-        ["0x25109139f8C4F9f7b4E4d5452A067feaE3a537F3"]
+        "0xabf5ff59333cfb575404834e68633fd81c77ff85d6d6f9983e29140ebdf805f4"
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xD8056243180C4b56a7d2ccd5df9c2696E1261826"]
      values.$pastUpgrades.0.1:
-        ["0xD8056243180C4b56a7d2ccd5df9c2696E1261826"]
+        "0x1361f48fea8fbc08ffbc0877f540635a35dffe6560829923443c70702232197d"
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0xe4e0f760409EB1661db76a4365c0803C3630270f"]
      values.$pastUpgrades.2.1:
-        ["0xe4e0f760409EB1661db76a4365c0803C3630270f"]
+        "0x4279b4a359b1d5abd672f9e7ee1923b9de372cce4077c2e673f3967b092e64cc"
      values.$pastUpgrades.1.2:
+        ["0x862E8e466ac49c1B076322AabCd4156326C47890"]
      values.$pastUpgrades.1.1:
-        ["0x862E8e466ac49c1B076322AabCd4156326C47890"]
+        "0x4279b4a359b1d5abd672f9e7ee1923b9de372cce4077c2e673f3967b092e64cc"
      values.$pastUpgrades.0.2:
+        ["0xe4e0f760409EB1661db76a4365c0803C3630270f"]
      values.$pastUpgrades.0.1:
-        ["0xe4e0f760409EB1661db76a4365c0803C3630270f"]
+        "0x1361f48fea8fbc08ffbc0877f540635a35dffe6560829923443c70702232197d"
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x99948157F4702B3EE9De4290C3dCDF2622Db9318"]
      values.$pastUpgrades.0.1:
-        ["0x99948157F4702B3EE9De4290C3dCDF2622Db9318"]
+        "0x1361f48fea8fbc08ffbc0877f540635a35dffe6560829923443c70702232197d"
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2.2:
+        ["0x31f395dd26430a8CBFa530e31B46aaf7ad517017"]
      values.$pastUpgrades.2.1:
-        ["0x31f395dd26430a8CBFa530e31B46aaf7ad517017"]
+        "0xf3e10d3de1b8d45a84bba5858cdc402584b2bc6d51ec993dad5db5ffea92250b"
      values.$pastUpgrades.1.2:
+        ["0xfeE76239E3ac25A05c5CdDC106E4B39B2C088029"]
      values.$pastUpgrades.1.1:
-        ["0xfeE76239E3ac25A05c5CdDC106E4B39B2C088029"]
+        "0xf3e10d3de1b8d45a84bba5858cdc402584b2bc6d51ec993dad5db5ffea92250b"
      values.$pastUpgrades.0.2:
+        ["0x31f395dd26430a8CBFa530e31B46aaf7ad517017"]
      values.$pastUpgrades.0.1:
-        ["0x31f395dd26430a8CBFa530e31B46aaf7ad517017"]
+        "0x1361f48fea8fbc08ffbc0877f540635a35dffe6560829923443c70702232197d"
    }
```

Generated with discovered.json: 0xe98adb0789bde32d3ed8a7819047bc393063dc4f

# Diff at Wed, 16 Oct 2024 11:35:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
+        "0xe1B64045351B0B6e9821F19b39f81bc4711D2230"
      issuedPermissions.1.via.0:
-        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.8.target:
-        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.8.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.7.target:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.6.target:
-        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
+        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
      receivedPermissions.5.target:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.4.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.4.target:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.4.via:
-        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.target:
-        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.3.via:
-        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
+        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
+        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xbfBAB4363034A930687B9320599a69DfBf1D21d0","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

Generated with discovered.json: 0xb298ccb30658a03330fa529c2264e7fd25bf4c7b

# Diff at Mon, 14 Oct 2024 10:49:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7","0xf3c7ecc8a3ece866c00e54f90a65843e8fd20e40ebc52fac59682640c2e1ca4b"]
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xe5211497d15a7ea75577cf992ab6093dd0f6083f45c955f0136737810e44c205"]
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x3ffed4eb8169f2ebc4abe07aaa71451c53653f6b89400b483cdd4be5dbc8513a"]
    }
```

Generated with discovered.json: 0x6f645ed4b338834b648c21b4f0979a3a0fcc5042

# Diff at Wed, 09 Oct 2024 13:09:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20919938
- current block number: 20919938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20919938 (main branch discovery), not current.

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x23e388bff7edd9b963516c7c4e0874b575b809df

# Diff at Tue, 08 Oct 2024 16:23:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 19960612
- current block number: 20919938

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
      fieldMeta.unsafeBlockSigner:
-        {"severity":"LOW","description":"Blocks are gossiped around the L2 p2p network before they are made available on L1. To prevent denial of service on the p2p layer, these unsafe blocks must be signed with a particular key to be accepted as 'canonical' unsafe blocks. The address corresponding to this key is the unsafeBlockSigner."}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
    }
```

Generated with discovered.json: 0x2b228aabc53db39c3f30b455b5446a59439ba6e8

# Diff at Tue, 01 Oct 2024 10:50:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-16T21:38:23.000Z",["0xfaE274B77BA59f001196689f93E9e73693866f4a"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-04-16T21:38:47.000Z",["0xd080A33E651780cD6f52F16020E1FFA04F0f15B2"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-08-12T18:24:06.000Z",["0x25109139f8C4F9f7b4E4d5452A067feaE3a537F3"]],["2021-10-05T19:35:22.000Z",["0xae6b041f0550EDeF61a70F76f89c77B2b1Ef38Fd"]],["2021-10-28T02:15:33.000Z",["0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820"]],["2024-04-16T21:38:23.000Z",["0x0000000000000000000000000000000000000000"]],["2024-04-16T21:38:47.000Z",["0x3b48597212f2622511585914CC4D4152c9B1B077"]]]
      values.$upgradeCount:
+        5
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-16T21:38:47.000Z",["0xD8056243180C4b56a7d2ccd5df9c2696E1261826"]]]
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-04-16T21:38:47.000Z",["0xe4e0f760409EB1661db76a4365c0803C3630270f"]],["2024-04-19T18:05:35.000Z",["0x862E8e466ac49c1B076322AabCd4156326C47890"]],["2024-04-19T18:05:35.000Z",["0xe4e0f760409EB1661db76a4365c0803C3630270f"]]]
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-04-16T21:38:47.000Z",["0x99948157F4702B3EE9De4290C3dCDF2622Db9318"]]]
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-16T21:38:47.000Z",["0x31f395dd26430a8CBFa530e31B46aaf7ad517017"]],["2024-04-19T18:04:11.000Z",["0xfeE76239E3ac25A05c5CdDC106E4B39B2C088029"]],["2024-04-19T18:04:11.000Z",["0x31f395dd26430a8CBFa530e31B46aaf7ad517017"]]]
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x576cc08d7de3d6d721fe264e3ba75a990b74a26b

# Diff at Fri, 13 Sep 2024 08:18:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@db4bedcf90d9785b74ad29fd9c12386741eb1cd5 block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      roles.1:
+        "Guardian"
      roles.0:
-        "Guardian"
+        "Challenger"
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.7.target:
-        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
+        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
+        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
      receivedPermissions.5.target:
-        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      receivedPermissions.4.target:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      receivedPermissions.3.target:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
+        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
      receivedPermissions.2.target:
-        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
+        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      receivedPermissions.0.target:
-        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
+        "0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"
      receivedPermissions.0.via:
-        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xc060048ef91e8642990dd4d32e274dd821640612

# Diff at Thu, 12 Sep 2024 15:23:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@e6761599b8d9e0b597372bb0e9ca885e08af7101 block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      directlyReceivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

Generated with discovered.json: 0xdd09bcc44cb14bff547f4232604978480e013848

# Diff at Sun, 08 Sep 2024 17:17:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x996ffD627901f10C80A7d4B72A12316D2e77c076","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB","via":[{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]}
      receivedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"
      receivedPermissions.0.via:
+        [{"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"}]
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"},{"permission":"upgrade","target":"0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"},{"permission":"upgrade","target":"0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"},{"permission":"upgrade","target":"0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"},{"permission":"upgrade","target":"0x996ffD627901f10C80A7d4B72A12316D2e77c076"},{"permission":"upgrade","target":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"},{"permission":"upgrade","target":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"},{"permission":"upgrade","target":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"},{"permission":"upgrade","target":"0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB"},{"permission":"upgrade","target":"0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"},{"permission":"upgrade","target":"0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"},{"permission":"upgrade","target":"0x996ffD627901f10C80A7d4B72A12316D2e77c076"},{"permission":"upgrade","target":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"},{"permission":"upgrade","target":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"},{"permission":"upgrade","target":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"}]
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
+        "0x56121a8612474C3eB65D69a3b871f284705b9bC4"
      issuedPermissions.0.via.0:
+        {"address":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","delay":0}
    }
```

Generated with discovered.json: 0x311a66cbfd1910df9fcd347d0275bc17b6a7079a

# Diff at Fri, 30 Aug 2024 07:51:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: It can act on behalf of 0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
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

Generated with discovered.json: 0x4530a0e30700e16fe226d3b2fad8b425a4879d88

# Diff at Fri, 23 Aug 2024 09:51:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xe2964eff0c0812869ddc32e07e32fec80abddbb0

# Diff at Wed, 21 Aug 2024 10:02:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: It can act on behalf of 0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB","0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","0x996ffD627901f10C80A7d4B72A12316D2e77c076","0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"],"configure":["0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089","via":[]},{"permission":"upgrade","target":"0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB","via":[]},{"permission":"upgrade","target":"0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","via":[]},{"permission":"upgrade","target":"0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","via":[]},{"permission":"upgrade","target":"0x996ffD627901f10C80A7d4B72A12316D2e77c076","via":[]},{"permission":"upgrade","target":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","via":[]},{"permission":"upgrade","target":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","via":[]},{"permission":"upgrade","target":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc","via":[]}]
    }
```

Generated with discovered.json: 0x196dd91e942989fa42b7aa76923c5317f2b0baf4

# Diff at Fri, 09 Aug 2024 11:58:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
+        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
      assignedPermissions.upgrade.5:
-        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
+        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
      assignedPermissions.upgrade.4:
-        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
+        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
      assignedPermissions.upgrade.3:
-        "0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741"
+        "0x996ffD627901f10C80A7d4B72A12316D2e77c076"
      assignedPermissions.upgrade.2:
-        "0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e"
+        "0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e"
      assignedPermissions.upgrade.1:
-        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
+        "0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3"
    }
```

Generated with discovered.json: 0xbc12c6b73f5949672169367cee636ce778c01d57

# Diff at Fri, 09 Aug 2024 10:08:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: It can act on behalf of 0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"]
      assignedPermissions.configure:
+        ["0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x796dF5BaB196b84FFf10F65ac0f914E4b10DEaCd","0xCCDEbe62f7378D5A931970A847cdf1EcFfc71C63","0x6976498e37E4941E167161fC3BC5191EEDc302ab","0x33A0B6C2Bd60A592C5e91dCCd5E5f403693F0AC1"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x796dF5BaB196b84FFf10F65ac0f914E4b10DEaCd","0xCCDEbe62f7378D5A931970A847cdf1EcFfc71C63","0x6976498e37E4941E167161fC3BC5191EEDc302ab","0x33A0B6C2Bd60A592C5e91dCCd5E5f403693F0AC1"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB","0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","0x996ffD627901f10C80A7d4B72A12316D2e77c076","0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"]
      assignedPermissions.owner:
-        ["0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"]
      assignedPermissions.upgrade:
+        ["0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB","0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","0x996ffD627901f10C80A7d4B72A12316D2e77c076"]
      assignedPermissions.configure:
+        ["0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089"]
    }
```

Generated with discovered.json: 0x347b2cb562fec1015c98209013acc16de0a3fa71

# Diff at Tue, 30 Jul 2024 11:11:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      fieldMeta:
+        {"unsafeBlockSigner":{"severity":"LOW","description":"Blocks are gossiped around the L2 p2p network before they are made available on L1. To prevent denial of service on the p2p layer, these unsafe blocks must be signed with a particular key to be accepted as 'canonical' unsafe blocks. The address corresponding to this key is the unsafeBlockSigner."},"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0xe567d8e1edc1a9346a7ebff53c952dd545933f9c

# Diff at Thu, 18 Jul 2024 10:30:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19960612
- current block number: 19960612

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19960612 (main branch discovery), not current.

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc, inheriting its permissions."]
      roles:
+        ["Guardian"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e) {
    +++ description: None
      categories:
+        ["Core"]
    }
```

```diff
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076) {
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
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741) {
    +++ description: None
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00) {
    +++ description: None
      categories:
+        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x106cf92638bb37dc1ec436c00ac53327ed375580

# Diff at Mon, 27 May 2024 10:29:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@011cd3764a8f949073c8175767ddea56db743d79 block: 19730704
- current block number: 19960612

## Description

Boba multisig withdraws ~18 ETH from their custom 'Lightbridge' contract and transfers it to an EOA in a second transaction. The Lightbridge is just an escrow controlled by BobaMultisig which currently allows ETH and BOBA to be bridged to Boba network as EBV. The new EOA seems to relay assets when users withdraw via the Lightbridge.

## Watched changes

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: None
      values.nonce:
-        6
+        8
    }
```

Generated with discovered.json: 0x893ec7c805d61e5411a2ecf38febe0ae42fef7d3

# Diff at Thu, 25 Apr 2024 06:50:54 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@9664a341efb1b7714c496f7505edd4cd97d0b7b0 block: 19704353
- current block number: 19730704

## Description

The _unsafeBlockSigner_ is changed by the BobaMultisig.

## Watched changes

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
+++ description: Blocks are gossiped around the L2 p2p network before they are made available on L1. To prevent denial of service on the p2p layer, these unsafe blocks must be signed with a particular key to be accepted as 'canonical' unsafe blocks. The address corresponding to this key is the unsafeBlockSigner.
+++ severity: LOW
      values.unsafeBlockSigner:
-        "0x077D266f9A3907837e716894517a12D1FD16Ac0a"
+        "0x4Ac69842680847e1135f514eE3d75172B685ECBf"
    }
```

```diff
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4) {
    +++ description: The Boba Network Upgrade Multisig (owner of the ProxyAdmin)
      values.nonce:
-        5
+        6
    }
```

Generated with discovered.json: 0x7f162218174b3f92e9abc658d954d551e7cb002c

# Diff at Sun, 21 Apr 2024 14:24:12 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19531460
- current block number: 19704353

## Description

Boba upgrades to the Bedrock architecture (they call the upgrade 'Anchorage') on OP stack. The contracts have very similar logic with other op stack L2s and highest similarity-score with karak.
Smart contract versions are the latest (some newer than optimism). Boba is allegedly using a multi-client setup (erigon and geth, to be researched).
The Governance is currently fully relying on one single 3/4 Multisig, who is the ProxyAdmin.

## Watched changes

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: None
      upgradeability.type:
-        "immutable"
+        "EIP1967 proxy"
      upgradeability.implementation:
+        "0xfaE274B77BA59f001196689f93E9e73693866f4a"
      upgradeability.admin:
+        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
      errors:
-        {"batcherHash":"Execution reverted","opStackDA":"Dependency error: Execution reverted","sequencerInbox":"Dependency error: Execution reverted"}
      derivedName:
-        "Proxy"
+        "SystemConfig"
      implementations:
+        ["0xfaE274B77BA59f001196689f93E9e73693866f4a"]
      values:
+        {"BATCH_INBOX_SLOT":"0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597","batcherHash":"0xe1B64045351B0B6e9821F19b39f81bc4711D2230","batchInbox":"0xfFF0000000000000000000000000000000000288","gasLimit":30000000,"L1_CROSS_DOMAIN_MESSENGER_SLOT":"0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636","L1_ERC_721_BRIDGE_SLOT":"0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7","L1_STANDARD_BRIDGE_SLOT":"0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376","l1CrossDomainMessenger":"0x6D4528d192dB72E282265D6092F4B872f9Dff69e","l1ERC721Bridge":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","l1StandardBridge":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","L2_OUTPUT_ORACLE_SLOT":"0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815","l2OutputOracle":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","minimumGasLimit":21000000,"opStackDA":{"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":true},"OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT":"0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c","OPTIMISM_PORTAL_SLOT":"0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac","optimismMintableERC20Factory":"0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","optimismPortal":"0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","overhead":2100,"owner":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","resourceConfig":[20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"],"scalar":1000000,"sequencerInbox":"0xfFF0000000000000000000000000000000000288","START_BLOCK_SLOT":"0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f","startBlock":19670770,"UNSAFE_BLOCK_SIGNER_SLOT":"0x65a7ed542fb37fe237fdfbdd70b31598523fe5b32879e307bae27a0bd9581c08","unsafeBlockSigner":"0x077D266f9A3907837e716894517a12D1FD16Ac0a","version":"1.12.0","VERSION":0}
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 ++++++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 ++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 +++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../.code/BobaMultisig/implementation/meta.txt     |   2 +
 .../.code/BobaMultisig/proxy/GnosisSafeProxy.sol   | 155 +++++++
 .../ethereum/.code/BobaMultisig/proxy/meta.txt     |   2 +
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts/access/OwnableUpgradeable.sol        |  95 ++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |   0
 .../L1CrossDomainMessenger/implementation/meta.txt |   2 +
 .../src/L1/L1CrossDomainMessenger.sol              |  80 ++++
 .../implementation/src/L1/L2OutputOracle.sol       | 316 +++++++++++++
 .../implementation/src/L1/OptimismPortal.sol       | 432 ++++++++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 161 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 366 +++++++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation}/src/libraries/Burn.sol         |   0
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  50 +++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPReader.sol | 261 +++++++++++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/libraries/trie/MerkleTrie.sol              | 220 +++++++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 +++
 .../src/universal/CrossDomainMessenger.sol         | 405 +++++++++++++++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/vendor/AddressAliasHelper.sol              |  43 ++
 .../@openzeppelin/contracts/access/Ownable.sol     |  68 +++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../libraries/resolver/Lib_AddressManager.sol      |  95 ++++
 .../resolver/Lib_ResolvedDelegateProxy.sol         |  74 ++++
 .../.code/L1CrossDomainMessenger/proxy/meta.txt    |   2 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++
 .../contracts/token/ERC721/IERC721.sol             | 143 ++++++
 .../token/ERC721/extensions/IERC721Enumerable.sol  |  29 ++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../utils/introspection/ERC165Checker.sol          | 123 ++++++
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L1ERC721Bridge/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L1ERC721Bridge.sol       | 121 +++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L2/L2ERC721Bridge.sol       | 126 ++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/universal/CrossDomainMessenger.sol         | 406 +++++++++++++++++
 .../implementation/src/universal/ERC721Bridge.sol  | 195 ++++++++
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../src/universal/IOptimismMintableERC721.sol      |  48 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/StandardBridge.sol               | 489 +++++++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/L1ERC721Bridge/proxy/meta.txt   |   2 +
 .../proxy}/src/L1/ResourceMetering.sol             |   0
 .../proxy}/src/libraries/Arithmetic.sol            |   0
 .../L1ERC721Bridge/proxy/src/libraries/Burn.sol    |  32 ++
 .../proxy}/src/libraries/Constants.sol             |   0
 .../L1ERC721Bridge/proxy}/src/universal/Proxy.sol  |   0
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../utils/introspection/ERC165Checker.sol          | 123 ++++++
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L1StandardBridge/implementation/meta.txt |   2 +
 .../implementation/src/L1/L1StandardBridge.sol     | 328 ++++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 161 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  50 +++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/universal/CrossDomainMessenger.sol         | 405 +++++++++++++++++
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/StandardBridge.sol               | 488 ++++++++++++++++++++
 .../contracts/chugsplash/L1ChugSplashProxy.sol     | 357 +++++++++++++++
 .../interfaces/iL1ChugSplashDeployer.sol           |  14 +
 .../ethereum/.code/L1StandardBridge/proxy/meta.txt |   2 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L2OutputOracle/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L2OutputOracle.sol       | 317 +++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../L2OutputOracle/proxy/src/libraries/Burn.sol    |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../L2OutputOracle/proxy/src/universal/Proxy.sol   | 168 +++++++
 .../@openzeppelin/contracts/access/Ownable.sol     |  68 +++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../libraries/resolver/Lib_AddressManager.sol      |  95 ++++
 .../ethereum/.code/Lib_AddressManager/meta.txt     |   2 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../implementation/meta.txt                        |   2 +
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/OptimismMintableERC20Factory.sol | 132 ++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../proxy/src/libraries/Burn.sol                   |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../proxy/src/universal/Proxy.sol                  | 168 +++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/access/OwnableUpgradeable.sol        |  95 ++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/OptimismPortal/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L2OutputOracle.sol       | 317 +++++++++++++
 .../implementation/src/L1/OptimismPortal.sol       | 433 ++++++++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 367 ++++++++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPReader.sol | 262 +++++++++++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/libraries/trie/MerkleTrie.sol              | 220 +++++++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 +++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/vendor/AddressAliasHelper.sol              |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../OptimismPortal/proxy/src/libraries/Burn.sol    |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../OptimismPortal/proxy/src/universal/Proxy.sol   | 168 +++++++
 .../ProxyAdmin/contracts/legacy/AddressManager.sol |  64 +++
 .../contracts/legacy/L1ChugSplashProxy.sol         | 289 ++++++++++++
 .../.code/ProxyAdmin/contracts/universal/Proxy.sol | 217 +++++++++
 .../ProxyAdmin/contracts/universal/ProxyAdmin.sol  | 254 +++++++++++
 .../bobanetwork/ethereum/.code/ProxyAdmin/meta.txt |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../.code/SuperchainConfig/implementation/meta.txt |   2 +
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../SuperchainConfig/proxy/src/universal/Proxy.sol | 168 +++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/access/OwnableUpgradeable.sol        |  95 ++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/SystemConfig/implementation/meta.txt     |   2 +
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SystemConfig.sol         | 367 ++++++++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../SystemConfig/proxy}/meta.txt                   |   0
 .../SystemConfig/proxy/src/L1/ResourceMetering.sol | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../SystemConfig/proxy/src/libraries/Burn.sol      |  32 ++
 .../SystemConfig/proxy/src/libraries/Constants.sol |  46 ++
 .../SystemConfig/proxy/src/universal/Proxy.sol     | 168 +++++++
 287 files changed, 35220 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531460 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger_2 (0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SCCStorageContainerBatches (0x13992B9f327faCA11568BE18a8ad3E9747e87d93)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CTCStorageContainerBatches (0x17148284d2da2f38c96346f1776C1BF7D7691231)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Proxy__L1LiquidityPoolArguments (0x1A26ef6575B7BBB864d984D9255C069F6c361a14)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1MultiMessageRelayerFast (0x2d6134Ac3e480fBDD263B7163d333dCA285f9622)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CTCQueue (0x5f003030884B3a105809a0Eb0C0C28Ac40ECCD8d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1MultiMessageRelayer (0x5fD2CF99586B9D92f56CbaD0A3Ea4DF256A0070B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BondManager (0x60660e6CDEb423cf847dD11De4C473130D65b627)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger_1 (0x6D4528d192dB72E282265D6092F4B872f9Dff69e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1NFTBridge (0xbF313aD6e476FF4ab6c01B76DfC74A47f2c9a582)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lib_ResolvedDelegateProxy (0xC891F466e53f40603250837282eAE4e22aD5b088)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1LiquidityPool (0xd24484926f1d130778B9ebd7ec594548b2D53CB1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0xdE7355C971A5B733fe2133753Abd7e5441d441Ec)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CanonicalTransactionChain (0xfBd2541e316948B259264c02f370eD088E04c3Db)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB)
    +++ description: None
```

Generated with discovered.json: 0x4115d59c156d818c65d985580ac465151edf6d9d

# Diff at Tue, 26 Sep 2023 13:56:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract StateCommitmentChain (0xdE7355C971A5B733fe2133753Abd7e5441d441Ec) {
      values.deletedStateBatches:
+        []
    }
```
