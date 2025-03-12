Generated with discovered.json: 0xae322c96502fe0e08fff0823e2c3272bbd91c52d

# Diff at Tue, 04 Mar 2025 11:25:39 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xb243b567494978534a0b770d1b23e135eb590012

# Diff at Tue, 04 Mar 2025 10:39:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20519437
    }
```

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      sinceBlock:
+        20519437
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20519437
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20519437
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20519437
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20519437
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20519437
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20519437
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20519437
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      sinceBlock:
+        20519437
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20519437
    }
```

Generated with discovered.json: 0xe39d5284b7dc64806c99272586868e3ef7802220

# Diff at Wed, 26 Feb 2025 10:32:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21802884
- current block number: 21802884

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x7cbafc5bfbb7b1f5460716fe4815ae361ff211aa

# Diff at Fri, 21 Feb 2025 14:06:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21802884
- current block number: 21802884

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x40557f3c27f8635b7058333392727d19df8b4999

# Diff at Fri, 21 Feb 2025 08:59:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x5a9b41eac22d1194a959c8bfc4a755a03216ae18

# Diff at Mon, 10 Feb 2025 19:03:55 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x00973ecc6c527059032bd501781758b5d5587296

# Diff at Sat, 08 Feb 2025 16:07:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21693095
- current block number: 21802884

## Description

EOA gov removed --> Gelato.

## Watched changes

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.2.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.1.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.2.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.1:
-        {"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"set and change address mappings.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      values.$members.1:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 1 (100%)"
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.1.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0x212125d3c7fcbb0eddc6945f4d91be21113ca25d

# Diff at Tue, 04 Feb 2025 12:31:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21693095
- current block number: 21693095

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21693095 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      receivedPermissions.4.description:
+        "set and change address mappings."
      receivedPermissions.4.via:
+        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "guard"
      receivedPermissions.2.from:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.via:
-        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x9716cff7d69a202efc143b5e91d342cbce20a15b

# Diff at Fri, 24 Jan 2025 08:14:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 21628387
- current block number: 21693095

## Description

EthernityMultisig member added (1/2).

## Watched changes

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.1:
+        {"permission":"configure","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"set and change address mappings.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      values.$members.1:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      values.$members.0:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x20c3035C92bdB4C461242571EeAc59EeD03Df931","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x14B768F93f256Ad8D2d018930DBdAe61306c4752","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x0eB331B615030819464225Ecd373e5FFBE502DC4","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.4:
+        {"permission":"guard","from":"0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"}
      receivedPermissions.3.from:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.2.permission:
-        "guard"
+        "configure"
      receivedPermissions.2.from:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

Generated with discovered.json: 0x2fd89e7f46bdb502e33cfecafa2d8d61b689e3d0

# Diff at Mon, 20 Jan 2025 11:09:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628387
- current block number: 21628387

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628387 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
    }
```

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      directlyReceivedPermissions.7.from:
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      directlyReceivedPermissions.6.target:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      directlyReceivedPermissions.6.from:
+        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      directlyReceivedPermissions.5.target:
-        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      directlyReceivedPermissions.5.from:
+        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      directlyReceivedPermissions.4.target:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      directlyReceivedPermissions.4.from:
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      directlyReceivedPermissions.3.target:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      directlyReceivedPermissions.3.from:
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      directlyReceivedPermissions.2.target:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      directlyReceivedPermissions.2.from:
+        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      directlyReceivedPermissions.1.target:
-        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      directlyReceivedPermissions.1.from:
+        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      directlyReceivedPermissions.0.target:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      directlyReceivedPermissions.0.from:
+        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.target:
-        "0xF49212F977986347b73345D382a811e148751eED"
      issuedPermissions.1.to:
+        "0xF49212F977986347b73345D382a811e148751eED"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.target:
-        "0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
      issuedPermissions.1.to:
+        "0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "set and change address mappings."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      directlyReceivedPermissions.0.from:
+        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.3.target:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.3.from:
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.2.target:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.2.from:
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.1.target:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.1.from:
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.0.target:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.0.from:
+        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xa2d562e15d4fc6b581c1004b63102dd863ddf064

# Diff at Wed, 15 Jan 2025 07:28:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21129680
- current block number: 21628387

## Description

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x8548d34d8a1fbb08c6c2da4fc0066684fd970276

# Diff at Wed, 08 Jan 2025 09:00:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21129680
- current block number: 21129680

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21129680 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xd38b72b316b50c6a6ae5cf75b0a9a9a0bef1d787

# Diff at Wed, 06 Nov 2024 16:04:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21129680

## Description

Standard OP stack Rollup with L2OutputOracle and FaultDisputeGame deployed in parallel (only L2OutputOracle used).

Also eoa admin. :()

0.99 debank l2 code similarity.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```
