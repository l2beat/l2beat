Generated with discovered.json: 0xafee9ecf49409e43fedec092f42ae505bfd5b938

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22346290
- current block number: 22346290

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346290 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x2E7B9465B25C081c07274A31DbD05C6146f67961","via":[]},{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","description":"set and change address mappings.","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x2E7B9465B25C081c07274A31DbD05C6146f67961","via":[]},{"permission":"propose","to":"0x88D58BFbCD70c25409b67117fC1CDfeFDA113a78","via":[]},{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x2E7B9465B25C081c07274A31DbD05C6146f67961","via":[]},{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x8CDa8351236199AF7532baD53D683Ddd9B275d89","via":[]},{"permission":"upgrade","to":"0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea","via":[{"address":"0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"}]}]
    }
```

Generated with discovered.json: 0xd928d644549cf33e731f53b7daf29bdfd058ed0a

# Diff at Fri, 25 Apr 2025 13:19:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@652ccb636c46013db1624f1ac3562cb4dcbc059b block: 21242938
- current block number: 22346290

## Description

Upgrade SystemConfig to known implementation.

## Watched changes

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xe72ac62d31A0CCc8Ecd2b3Ac80E73479641715e2"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.2:
+        ["2025-04-24T15:12:59.000Z","0x1219b34d44c22cc95607948fa43919e4015c77fb6ae8aeda540a4fbf11636242",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.1:
+        ["2024-07-08T08:29:23.000Z","0x3d2be3c5ca9e5dd726fde8d99662c3a271b676377d58e6784617cab843668e9c",["0xe72ac62d31A0CCc8Ecd2b3Ac80E73479641715e2"]]
      values.$pastUpgrades.0.2:
-        "2024-07-08T08:29:23.000Z"
+        "0x1219b34d44c22cc95607948fa43919e4015c77fb6ae8aeda540a4fbf11636242"
      values.$pastUpgrades.0.1.0:
-        "0xe72ac62d31A0CCc8Ecd2b3Ac80E73479641715e2"
+        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.0.0:
-        "0x3d2be3c5ca9e5dd726fde8d99662c3a271b676377d58e6784617cab843668e9c"
+        "2025-04-24T15:12:59.000Z"
      values.$upgradeCount:
-        1
+        3
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      values.version:
-        "1.12.0"
+        "2.3.0"
      values.basefeeScalar:
+        1101
      values.blobbasefeeScalar:
+        659851
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

Generated with discovered.json: 0x5e91dd37ddeb5c6a836774a60053eb242a5ffe67

# Diff at Thu, 27 Mar 2025 11:14:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21242938
- current block number: 21242938

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x9d8fee935c85dbb1c90d7d0f5e26bdbb119553a5

# Diff at Wed, 19 Mar 2025 13:05:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract Race Multisig 2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x88D58BFbCD70c25409b67117fC1CDfeFDA113a78) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x3900d8f1e6671fdbdb837e89737abaef0d91f68d

# Diff at Tue, 18 Mar 2025 08:13:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21242938
- current block number: 21242938

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract Race Multisig 2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961) {
    +++ description: None
      name:
-        "RaceMultisig2"
+        "Race Multisig 2"
    }
```

```diff
    contract Race Multisig 1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea) {
    +++ description: None
      name:
-        "RaceMultisig1"
+        "Race Multisig 1"
    }
```

```diff
    contract Race Multisig 3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9) {
    +++ description: None
      name:
-        "RaceMultisig3"
+        "Race Multisig 3"
    }
```

Generated with discovered.json: 0x04b0486994e64807830cd99cf5859f42004e003d

# Diff at Tue, 04 Mar 2025 11:26:12 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x8e2a6d6909b29f5898bb7e18ec47c36e1bd27064

# Diff at Tue, 04 Mar 2025 10:39:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20260590
    }
```

```diff
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20260596
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20260595
    }
```

```diff
    contract RaceMultisig2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961) {
    +++ description: None
      sinceBlock:
+        20127951
    }
```

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20260579
    }
```

```diff
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea) {
    +++ description: None
      sinceBlock:
+        20260577
    }
```

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20260593
    }
```

```diff
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20260591
    }
```

```diff
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191) {
    +++ description: None
      sinceBlock:
+        20260580
    }
```

```diff
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9) {
    +++ description: None
      sinceBlock:
+        20127852
    }
```

```diff
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20260583
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20260592
    }
```

```diff
    contract L1CrossDomainMessenger (0xf54B2BAEF894cfF5511A5722Acaac0409F2F2d89) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20260594
    }
```

Generated with discovered.json: 0xd08e8ce174f0fa9146a882358574804964f55350

# Diff at Wed, 26 Feb 2025 10:32:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21242938
- current block number: 21242938

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xf54B2BAEF894cfF5511A5722Acaac0409F2F2d89) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x393a3f0f997b06d7f146ebcc264b21153f077a52

# Diff at Fri, 21 Feb 2025 14:10:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21242938
- current block number: 21242938

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract RaceMultisig2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

```diff
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xdaac48696022b772469a6dbe3df4dda1fe673afc

# Diff at Fri, 21 Feb 2025 08:59:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xf54B2BAEF894cfF5511A5722Acaac0409F2F2d89) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xd8b41eb2530aefdc54d23409cc9bfa0b095ce6e4

# Diff at Mon, 10 Feb 2025 19:04:29 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x015e77aca1803c88183066cb70cce4c93ed97314

# Diff at Tue, 04 Feb 2025 12:31:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21242938
- current block number: 21242938

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0db533b96bb22c3abd7e82e5c099d17845bcfa4b

# Diff at Mon, 20 Jan 2025 11:09:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21242938
- current block number: 21242938

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.target:
-        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
      issuedPermissions.0.to:
+        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
    }
```

```diff
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
    }
```

```diff
    contract RaceMultisig2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.2.from:
+        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.1.target:
-        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.1.from:
+        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.0.target:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      receivedPermissions.0.from:
+        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
    }
```

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      receivedPermissions.7.from:
+        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      receivedPermissions.6.target:
-        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.6.from:
+        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.5.target:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      receivedPermissions.5.from:
+        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      receivedPermissions.4.target:
-        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      receivedPermissions.4.from:
+        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      receivedPermissions.3.target:
-        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      receivedPermissions.3.from:
+        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      receivedPermissions.2.target:
-        "0x0f33D824d74180598311b3025095727BeA61f219"
      receivedPermissions.2.from:
+        "0x0f33D824d74180598311b3025095727BeA61f219"
      receivedPermissions.1.target:
-        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.1.from:
+        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.0.target:
-        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
      receivedPermissions.0.from:
+        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
      directlyReceivedPermissions.0.target:
-        "0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"
      directlyReceivedPermissions.0.from:
+        "0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"
    }
```

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.target:
-        "0x88D58BFbCD70c25409b67117fC1CDfeFDA113a78"
      issuedPermissions.1.to:
+        "0x88D58BFbCD70c25409b67117fC1CDfeFDA113a78"
      issuedPermissions.0.target:
-        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
      issuedPermissions.0.to:
+        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
    }
```

```diff
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      directlyReceivedPermissions.7.from:
+        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      directlyReceivedPermissions.6.target:
-        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      directlyReceivedPermissions.6.from:
+        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      directlyReceivedPermissions.5.target:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      directlyReceivedPermissions.5.from:
+        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      directlyReceivedPermissions.4.target:
-        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      directlyReceivedPermissions.4.from:
+        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      directlyReceivedPermissions.3.target:
-        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      directlyReceivedPermissions.3.from:
+        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      directlyReceivedPermissions.2.target:
-        "0x0f33D824d74180598311b3025095727BeA61f219"
      directlyReceivedPermissions.2.from:
+        "0x0f33D824d74180598311b3025095727BeA61f219"
      directlyReceivedPermissions.1.target:
-        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      directlyReceivedPermissions.1.from:
+        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      directlyReceivedPermissions.0.target:
-        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
      directlyReceivedPermissions.0.from:
+        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
    }
```

```diff
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      receivedPermissions.0.from:
+        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
    }
```

```diff
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.target:
-        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
      issuedPermissions.0.to:
+        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.target:
-        "0x8CDa8351236199AF7532baD53D683Ddd9B275d89"
      issuedPermissions.1.to:
+        "0x8CDa8351236199AF7532baD53D683Ddd9B275d89"
      issuedPermissions.0.target:
-        "0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9"
      issuedPermissions.0.to:
+        "0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xb5f16304518b4d85a7ae821e7541998707a0fe1d

# Diff at Wed, 08 Jan 2025 09:05:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x29a31ce32867ad4248aa13a2a6be0a785221611b

# Diff at Fri, 22 Nov 2024 11:21:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21242938

## Description

Standard opstack rollup with 3 weird multisigs and fake superchain.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract RaceMultisig2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf54B2BAEF894cfF5511A5722Acaac0409F2F2d89)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
