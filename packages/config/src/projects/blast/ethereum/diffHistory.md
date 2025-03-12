Generated with discovered.json: 0xe6d5bf85ea7b0d9f06c90013d93838e7362051af

# Diff at Tue, 04 Mar 2025 11:25:29 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21084957
- current block number: 21084957

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x3064e68cdd6e265b3f0851f90569646cd46d99cd

# Diff at Tue, 04 Mar 2025 10:38:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21084957
- current block number: 21084957

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract DSRYieldProvider (0x0733F618118bF420b6b604c969498ecf143681a8) {
    +++ description: Yield Provider for DAI investing DAI into the MakerDAO DSR.
      sinceBlock:
+        19300419
    }
```

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19300357
    }
```

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      sinceBlock:
+        19300355
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2.
      sinceBlock:
+        19300361
    }
```

```diff
    contract LidoYieldProvider (0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db) {
    +++ description: Yield Provider for ETH investing ETH into stETH.
      sinceBlock:
+        19300417
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      sinceBlock:
+        19300385
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19300359
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19300366
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      sinceBlock:
+        18602739
    }
```

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      sinceBlock:
+        18574084
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19300360
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19300368
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19300358
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: Contract managing Yield Providers for ETH.
      sinceBlock:
+        19300362
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI).
      sinceBlock:
+        19300363
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19300369
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19300354
    }
```

Generated with discovered.json: 0x4879e86fc5514c43d3f67ca682654162775d02d3

# Diff at Wed, 26 Feb 2025 10:32:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21084957
- current block number: 21084957

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xf87665a181f48adebbac76d96bc6e855aeeadbda

# Diff at Fri, 21 Feb 2025 14:05:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21084957
- current block number: 21084957

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x1ee061059024a79e08269c743427b56fb5816081

# Diff at Fri, 21 Feb 2025 08:59:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21084957
- current block number: 21084957

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x7dd6e55af8e43a0fa837ffc72a7718feb22f612c

# Diff at Mon, 10 Feb 2025 19:03:44 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21084957
- current block number: 21084957

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xb2f4fba18d14845386d2666f588410b64a8bd4ba

# Diff at Tue, 04 Feb 2025 12:30:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21084957
- current block number: 21084957

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
+        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.via:
+        [{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
+        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.via:
-        [{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
+        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xa9836c33d4c045291f505b58c9b60a7cdd041808

# Diff at Mon, 20 Jan 2025 11:09:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21084957
- current block number: 21084957

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"
      directlyReceivedPermissions.9.from:
+        "0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"
      directlyReceivedPermissions.8.target:
-        "0xa230285d5683C74935aD14c446e137c8c8828438"
      directlyReceivedPermissions.8.from:
+        "0xa230285d5683C74935aD14c446e137c8c8828438"
      directlyReceivedPermissions.7.target:
-        "0x98078db053902644191f93988341E31289E1C8FE"
      directlyReceivedPermissions.7.from:
+        "0x98078db053902644191f93988341E31289E1C8FE"
      directlyReceivedPermissions.6.target:
-        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      directlyReceivedPermissions.6.from:
+        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      directlyReceivedPermissions.5.target:
-        "0x6B916DcCa661d23794e78509723A6f4348564847"
      directlyReceivedPermissions.5.from:
+        "0x6B916DcCa661d23794e78509723A6f4348564847"
      directlyReceivedPermissions.4.target:
-        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
      directlyReceivedPermissions.4.from:
+        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
      directlyReceivedPermissions.3.target:
-        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      directlyReceivedPermissions.3.from:
+        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      directlyReceivedPermissions.2.target:
-        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
      directlyReceivedPermissions.2.from:
+        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
      directlyReceivedPermissions.1.target:
-        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      directlyReceivedPermissions.1.from:
+        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      directlyReceivedPermissions.0.target:
-        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
      directlyReceivedPermissions.0.from:
+        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2.
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      receivedPermissions.12.target:
-        "0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"
      receivedPermissions.12.from:
+        "0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"
      receivedPermissions.11.target:
-        "0xa230285d5683C74935aD14c446e137c8c8828438"
      receivedPermissions.11.from:
+        "0xa230285d5683C74935aD14c446e137c8c8828438"
      receivedPermissions.10.target:
-        "0x98078db053902644191f93988341E31289E1C8FE"
      receivedPermissions.10.from:
+        "0x98078db053902644191f93988341E31289E1C8FE"
      receivedPermissions.9.target:
-        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      receivedPermissions.9.from:
+        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      receivedPermissions.8.target:
-        "0x6B916DcCa661d23794e78509723A6f4348564847"
      receivedPermissions.8.from:
+        "0x6B916DcCa661d23794e78509723A6f4348564847"
      receivedPermissions.7.target:
-        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
      receivedPermissions.7.from:
+        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
      receivedPermissions.6.target:
-        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      receivedPermissions.6.from:
+        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      receivedPermissions.5.target:
-        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
      receivedPermissions.5.from:
+        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
      receivedPermissions.4.target:
-        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      receivedPermissions.4.from:
+        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      receivedPermissions.3.target:
-        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      receivedPermissions.3.from:
+        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
      receivedPermissions.2.target:
-        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
      receivedPermissions.2.from:
+        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
      receivedPermissions.1.target:
-        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      receivedPermissions.1.from:
+        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      receivedPermissions.0.target:
-        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      receivedPermissions.0.from:
+        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      directlyReceivedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
      directlyReceivedPermissions.0.from:
+        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.1.target:
-        "0x415c8893D514F9BC5211d36eEDA4183226b84AA7"
      issuedPermissions.1.to:
+        "0x415c8893D514F9BC5211d36eEDA4183226b84AA7"
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C"
      issuedPermissions.0.to:
+        "0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C"
    }
```

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d"
      receivedPermissions.0.from:
+        "0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d"
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.1.target:
-        "0x082b616Ec99167B2FEdee053F07db6795D4dA821"
      issuedPermissions.1.to:
+        "0x082b616Ec99167B2FEdee053F07db6795D4dA821"
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: Contract managing Yield Providers for ETH.
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI).
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x024b72a9859fd8b21cea24c6eacc40aca81fe4ca

# Diff at Wed, 08 Jan 2025 08:59:01 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21084957
- current block number: 21084957

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x5f11551b9ea8e37340906047bca04d2003726e17

# Diff at Fri, 01 Nov 2024 12:09:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21084957
- current block number: 21084957

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084957 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x4fdc678d5c1ed9d013292a90b0e86abefae2d4a4

# Diff at Thu, 31 Oct 2024 10:16:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84a13943cfff44401b50d4994977c7433a8d7a1d block: 20921743
- current block number: 21084957

## Description

Config related (new shape match).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.1.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0xE064B565Cf2A312a3e66Fe4118890583727380C0","description":"set and change address mappings."},{"permission":"upgrade","target":"0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"},{"permission":"upgrade","target":"0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"},{"permission":"upgrade","target":"0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"},{"permission":"upgrade","target":"0x697402166Fbf2F22E970df8a6486Ef171dbfc524","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x6B916DcCa661d23794e78509723A6f4348564847"},{"permission":"upgrade","target":"0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"},{"permission":"upgrade","target":"0x98078db053902644191f93988341E31289E1C8FE"},{"permission":"upgrade","target":"0xa230285d5683C74935aD14c446e137c8c8828438"},{"permission":"upgrade","target":"0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xE064B565Cf2A312a3e66Fe4118890583727380C0","description":"set and change address mappings."},{"permission":"upgrade","target":"0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"},{"permission":"upgrade","target":"0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"},{"permission":"upgrade","target":"0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"},{"permission":"upgrade","target":"0x697402166Fbf2F22E970df8a6486Ef171dbfc524","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x6B916DcCa661d23794e78509723A6f4348564847"},{"permission":"upgrade","target":"0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"},{"permission":"upgrade","target":"0x98078db053902644191f93988341E31289E1C8FE"},{"permission":"upgrade","target":"0xa230285d5683C74935aD14c446e137c8c8828438"},{"permission":"upgrade","target":"0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"}]
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2.
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","target":"0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xa230285d5683C74935aD14c446e137c8c8828438","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0x98078db053902644191f93988341E31289E1C8FE","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x6B916DcCa661d23794e78509723A6f4348564847","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x697402166Fbf2F22E970df8a6486Ef171dbfc524","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb","via":[{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]}
      receivedPermissions.3:
+        {"permission":"guard","target":"0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"}
      receivedPermissions.2.permission:
-        "guard"
+        "configure"
      receivedPermissions.2.target:
-        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
+        "0xE064B565Cf2A312a3e66Fe4118890583727380C0"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883"}]
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.2.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.2.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: Contract managing Yield Providers for ETH.
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI).
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0}
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      issuedPermissions.0.via.0:
+        {"address":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","delay":0,"description":"set and change address mappings."}
    }
```

Generated with discovered.json: 0x654059fa7af8ba369109b23366a10be3d7eeddaf

# Diff at Tue, 29 Oct 2024 13:05:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20921743
- current block number: 20921743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xcae4dbacefc716968d5b6606979fe780b86fc417

# Diff at Mon, 21 Oct 2024 12:43:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20921743
- current block number: 20921743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract DSRYieldProvider (0x0733F618118bF420b6b604c969498ecf143681a8) {
    +++ description: Yield Provider for DAI investing DAI into the MakerDAO DSR.
      descriptions:
-        ["Yield Provider for DAI investing DAI into the MakerDAO DSR."]
      description:
+        "Yield Provider for DAI investing DAI into the MakerDAO DSR."
    }
```

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2.
      descriptions:
-        ["Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2."]
      description:
+        "Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2."
    }
```

```diff
    contract LidoYieldProvider (0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db) {
    +++ description: Yield Provider for ETH investing ETH into stETH.
      descriptions:
-        ["Yield Provider for ETH investing ETH into stETH."]
      description:
+        "Yield Provider for ETH investing ETH into stETH."
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: Contract managing Yield Providers for ETH.
      descriptions:
-        ["Contract managing Yield Providers for ETH."]
      description:
+        "Contract managing Yield Providers for ETH."
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI).
      descriptions:
-        ["Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI)."]
      description:
+        "Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI)."
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0xe6ec803978363407182b5b2c3b208cff240fa54d

# Diff at Mon, 21 Oct 2024 11:04:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20921743
- current block number: 20921743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.1.2:
+        ["0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391"]
      values.$pastUpgrades.1.1:
-        ["0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391"]
+        "0xb813416a1e599fbebc813b4e9a8c29e5d94d45e8da6e10e86935768caed38e98"
      values.$pastUpgrades.0.2:
+        ["0xd7bfDa9B3b014b16bada89F206607a8Ac7c6FB32"]
      values.$pastUpgrades.0.1:
-        ["0xd7bfDa9B3b014b16bada89F206607a8Ac7c6FB32"]
+        "0xf82923e94578148fd33c7e506f9e5db98ca060c911b41c5b6697d167738dd6a0"
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xA150f19B681a06E1a0B7E03934299a9bf9238cb7"]
      values.$pastUpgrades.0.1:
-        ["0xA150f19B681a06E1a0B7E03934299a9bf9238cb7"]
+        "0xbe85666f88251637a983ac9ef301efcaa2fb56f8303b769b634404955be5dabf"
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.2.2:
+        ["0x84efcFCE2dEe08072d5D57BF232D379b6E92A836"]
      values.$pastUpgrades.2.1:
-        ["0x84efcFCE2dEe08072d5D57BF232D379b6E92A836"]
+        "0xcd5f72853d01d93a1fbf3d219a77c7f0243b0fd537d14737c3b0691f0897d67c"
      values.$pastUpgrades.1.2:
+        ["0xe7406f6d89a14aC3Fc28530479327948ea500659"]
      values.$pastUpgrades.1.1:
-        ["0xe7406f6d89a14aC3Fc28530479327948ea500659"]
+        "0x718f17591631857e26554f08b52874c1826d990a5c53d8496b12c860509615ed"
      values.$pastUpgrades.0.2:
+        ["0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0"]
      values.$pastUpgrades.0.1:
-        ["0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0"]
+        "0xb9df50a5931e96f2c6f8055055cf2943009705a369b845fbb3e0202a7b897223"
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x0bD88b59D580549285f0A207Db5F06bf24a8e561"]
      values.$pastUpgrades.2.1:
-        ["0x0bD88b59D580549285f0A207Db5F06bf24a8e561"]
+        "0x57c1c448e2afa4910ac0637260bcca28a4f0cd0b32abb001b261338962d38052"
      values.$pastUpgrades.1.2:
+        ["0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"]
      values.$pastUpgrades.1.1:
-        ["0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"]
+        "0xb325f82fb0bd7454471789a44740a7bd3a81690a4e9c411e5c53e9412de149ca"
      values.$pastUpgrades.0.2:
+        ["0xa01Def05A37850b2e13C8c839AA268845Df14276"]
      values.$pastUpgrades.0.1:
-        ["0xa01Def05A37850b2e13C8c839AA268845Df14276"]
+        "0xb7f9a32a4d0d38440243d90730e7048ab1eea8c5301da80805131205a7759b4e"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xBF21bc9AFaF817145B3886caDAF0860A2A0D782F"]
      values.$pastUpgrades.0.1:
-        ["0xBF21bc9AFaF817145B3886caDAF0860A2A0D782F"]
+        "0x56b371e38c6925d31d80525dc061b211c4c5070dfea14e6e34036f731443c516"
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2.2:
+        ["0x1C90963D451316E3DBFdD5A30354EE56C29016EB"]
      values.$pastUpgrades.2.1:
-        ["0x1C90963D451316E3DBFdD5A30354EE56C29016EB"]
+        "0xf9716c8e311c27decc5858f10b2a2c83ef3d8ce3958cfb242df5415a75b1e6eb"
      values.$pastUpgrades.1.2:
+        ["0xaEbA6c3042B463DfAA6A2DFA96486D5A92186cFF"]
      values.$pastUpgrades.1.1:
-        ["0xaEbA6c3042B463DfAA6A2DFA96486D5A92186cFF"]
+        "0x4e7b5b82e00b92a5b0380e3a47801760a35f00462793f28926184e984cddc478"
      values.$pastUpgrades.0.2:
+        ["0x1c952514f0353d84d9ad35BcfB8E9Ea979289031"]
      values.$pastUpgrades.0.1:
-        ["0x1c952514f0353d84d9ad35BcfB8E9Ea979289031"]
+        "0x6294e04e136d66468e369543e2789863e2f036ab8e80d473d6808e414c3e233a"
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x3B01aDF2f199144233A536b08244d63e5eb691B8"]
      values.$pastUpgrades.0.1:
-        ["0x3B01aDF2f199144233A536b08244d63e5eb691B8"]
+        "0x90946309f20c1cbbf4e4204b8f1aebb438908064a941cbd0882028dbe04dab22"
    }
```

Generated with discovered.json: 0x1950acbccf345dbf152e230d91647a664bec1c3b

# Diff at Wed, 16 Oct 2024 11:35:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20921743
- current block number: 20921743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.2:
+        {"permission":"guard","target":"0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"}
      receivedPermissions.1:
+        {"permission":"configure","target":"0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
+        "0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x415c8893D514F9BC5211d36eEDA4183226b84AA7"
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x082b616Ec99167B2FEdee053F07db6795D4dA821","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

Generated with discovered.json: 0x41bdcabe0915cb0b2b769a7aa71a1d620238d40b

# Diff at Mon, 14 Oct 2024 10:49:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20921743
- current block number: 20921743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract DSRYieldProvider (0x0733F618118bF420b6b604c969498ecf143681a8) {
    +++ description: Yield Provider for DAI investing DAI into the MakerDAO DSR.
      sourceHashes:
+        ["0xb4bd2b8453fbde4b776b6b9653139c16e0c673e589025d3d3fe553933fdab859"]
    }
```

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0xb3a50793a004e7679dcb326be57efe8df5bea72fc250e4fc7505b2c5dc53fb86","0xd40fa201f3d213c5e7a8e44bcd59d3f28c198741c50a733c20af045c60a2914d"]
    }
```

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      sourceHashes:
+        ["0xb6eaecb36b3255721e6a4b99c79ab661b8c1691f6d6e630956458b67ae012104"]
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2.
      sourceHashes:
+        ["0x25b3b37613a93de74b5c7b795eb7f1446dfea8b9e763cfebe29c2f2881acfbb3","0x9b25fea33ece84240133b9633d6edebfa268b929644604f9ec3ef4fbcd97ac60"]
    }
```

```diff
    contract LidoYieldProvider (0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db) {
    +++ description: Yield Provider for ETH investing ETH into stETH.
      sourceHashes:
+        ["0x085a7e18c46eb9d391f5ffaf3469ac7fcb4a361abf098f4aee3e6f4c03670368"]
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0xb3a50793a004e7679dcb326be57efe8df5bea72fc250e4fc7505b2c5dc53fb86","0x5287b087cec2244d57a3cea230c0c70a9b5fd8d4fdca71f7d85d34a8a22792b1"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x62b0361291c40e624393723bdac21e4ecdb590904474346417c941734984bb25"]
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      sourceHashes:
+        ["0x73794f4d5d902d84fab5db7010571b31475a0a5d0de21348cbea9f221964a26a","0x5c353b5bca59f0970c0a2ab9d5bebc21738761aa447e35d48814660b52ae9955"]
    }
```

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0x25b3b37613a93de74b5c7b795eb7f1446dfea8b9e763cfebe29c2f2881acfbb3","0xf5e9d1b6ac4bf84529eacc8e29c0731ef1524f2a84cbd91fb9840cf631cfff7c"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0xb3a50793a004e7679dcb326be57efe8df5bea72fc250e4fc7505b2c5dc53fb86","0x3199ce561d915dec4e96a05f056d262ab4af7342a28a8c1b65b73aad49850d0e"]
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0xb3a50793a004e7679dcb326be57efe8df5bea72fc250e4fc7505b2c5dc53fb86","0x373b0cddb16922a75ab98dfce0c4913a0970c018bfa1d55d123d4ff6511179a6"]
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: Contract managing Yield Providers for ETH.
      sourceHashes:
+        ["0x25b3b37613a93de74b5c7b795eb7f1446dfea8b9e763cfebe29c2f2881acfbb3","0x5d1416fc2e9565203ff83a5f989b55c635a3c9c11d7655a7d7f8e4a2e63ede7d"]
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI).
      sourceHashes:
+        ["0x25b3b37613a93de74b5c7b795eb7f1446dfea8b9e763cfebe29c2f2881acfbb3","0xf99e492f3d76fa74e24ea285b4e7de6199ab1f71a8de99f523785133dac44581"]
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0xb3a50793a004e7679dcb326be57efe8df5bea72fc250e4fc7505b2c5dc53fb86","0x17f0c97db13062aa8299e78c5d1a68b5152ce948b2fe10e5283857bd6a15ce4f"]
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

Generated with discovered.json: 0x283fe44c581b2f8b94c41dac3552f53a413107d2

# Diff at Wed, 09 Oct 2024 13:09:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20921743
- current block number: 20921743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20921743 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x275e73455341fbccfe83604eb8606015aa998bbb

# Diff at Tue, 08 Oct 2024 16:23:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20661171
- current block number: 20921743

## Description

Use discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20661171 (main branch discovery), not current.

```diff
    contract DSRYieldProvider (0x0733F618118bF420b6b604c969498ecf143681a8) {
    +++ description: Yield Provider for DAI investing DAI into the MakerDAO DSR.
      descriptions:
+        ["Yield Provider for DAI investing DAI into the MakerDAO DSR."]
    }
```

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      receivedPermissions.11:
-        {"permission":"upgrade","target":"0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873"}
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6"}
      receivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2.
      descriptions:
+        ["Custom bridge gateway for Blast that allows the Operators to reinvest L1 tokens while they are bridged to the L2."]
    }
```

```diff
    contract LidoYieldProvider (0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db) {
    +++ description: Yield Provider for ETH investing ETH into stETH.
      descriptions:
+        ["Yield Provider for ETH investing ETH into stETH."]
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"configure","target":"0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}]
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x364289230b8cc7d9120eF962AF37ebCFe23cE883"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: Contract managing Yield Providers for ETH.
      descriptions:
+        ["Contract managing Yield Providers for ETH."]
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI).
      descriptions:
+        ["Contract escrowing stablecoins and managing Yield Providers for stablecoins (like for example DAI)."]
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
-   Status: DELETED
    contract Insurance (0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Insurance (0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873)
    +++ description: None
```

Generated with discovered.json: 0x05766ad6e7bc3f039704cf4f8fafb808b23d4b4b

# Diff at Tue, 01 Oct 2024 10:50:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20661171
- current block number: 20661171

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20661171 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T22:26:11.000Z",["0xd7bfDa9B3b014b16bada89F206607a8Ac7c6FB32"]],["2024-03-27T01:00:59.000Z",["0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391"]]]
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T22:20:35.000Z",["0xA150f19B681a06E1a0B7E03934299a9bf9238cb7"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T22:16:35.000Z",["0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0"]],["2024-02-24T22:25:11.000Z",["0xe7406f6d89a14aC3Fc28530479327948ea500659"]],["2024-02-27T01:32:47.000Z",["0x84efcFCE2dEe08072d5D57BF232D379b6E92A836"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T01:59:47.000Z",["0xa01Def05A37850b2e13C8c839AA268845Df14276"]],["2023-12-11T19:01:59.000Z",["0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"]],["2024-02-19T01:12:23.000Z",["0x0bD88b59D580549285f0A207Db5F06bf24a8e561"]]]
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T22:24:35.000Z",["0xBF21bc9AFaF817145B3886caDAF0860A2A0D782F"]]]
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T22:25:35.000Z",["0x1c952514f0353d84d9ad35BcfB8E9Ea979289031"]],["2024-02-29T09:56:59.000Z",["0xaEbA6c3042B463DfAA6A2DFA96486D5A92186cFF"]],["2024-07-16T03:45:47.000Z",["0x1C90963D451316E3DBFdD5A30354EE56C29016EB"]]]
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T22:24:23.000Z",["0x3B01aDF2f199144233A536b08244d63e5eb691B8"]]]
    }
```

```diff
    contract Insurance (0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Insurance (0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0xcfb42636cbc1fe3f8d87d1234f42014f5df2a21b

# Diff at Mon, 02 Sep 2024 06:44:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 20317887
- current block number: 20661171

## Description

USDYieldManager contract is upgraded to change the immutable constant PSM to the [new price stability module 'LITE-PSM-USDC-A'](https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024) by MakerDAO.

## Watched changes

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      values.$implementation:
-        "0xE1cB7358311eCc408e1EFC47ceDc6740A8F68013"
+        "0xeCDdf748A60E23609c07af6CA3856744B139B911"
    }
```

## Source code changes

```diff
.../USDYieldManager/USDYieldManager.sol            | 25 ++++++++++++++--------
 1 file changed, 16 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0x77eb9fea3bccc1e71fd3c0ab81a739c8ab32a583

# Diff at Fri, 30 Aug 2024 07:51:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20317887
- current block number: 20317887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317887 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      receivedPermissions.11.via:
-        []
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

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x26d0d903cf1bd821fbb66fb1166263964a0cadd0

# Diff at Fri, 23 Aug 2024 09:51:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20317887
- current block number: 20317887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317887 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Insurance (0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Insurance (0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xeefc75d66ebcf4bcfe51051346a30ffe199caf10

# Diff at Wed, 21 Aug 2024 10:02:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20317887
- current block number: 20317887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317887 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb","0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115","0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","0x697402166Fbf2F22E970df8a6486Ef171dbfc524","0x6B916DcCa661d23794e78509723A6f4348564847","0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76","0x98078db053902644191f93988341E31289E1C8FE","0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6","0xa230285d5683C74935aD14c446e137c8c8828438","0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975","0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873"],"configure":["0xE064B565Cf2A312a3e66Fe4118890583727380C0"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xE064B565Cf2A312a3e66Fe4118890583727380C0","via":[]},{"permission":"upgrade","target":"0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb","via":[]},{"permission":"upgrade","target":"0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115","via":[]},{"permission":"upgrade","target":"0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","via":[]},{"permission":"upgrade","target":"0x697402166Fbf2F22E970df8a6486Ef171dbfc524","via":[]},{"permission":"upgrade","target":"0x6B916DcCa661d23794e78509723A6f4348564847","via":[]},{"permission":"upgrade","target":"0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76","via":[]},{"permission":"upgrade","target":"0x98078db053902644191f93988341E31289E1C8FE","via":[]},{"permission":"upgrade","target":"0xa230285d5683C74935aD14c446e137c8c8828438","via":[]},{"permission":"upgrade","target":"0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975","via":[]},{"permission":"upgrade","target":"0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6","via":[]},{"permission":"upgrade","target":"0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873","via":[]}]
    }
```

```diff
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C","via":[]}]
    }
```

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract Insurance (0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract Insurance (0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

```diff
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x364289230b8cc7d9120eF962AF37ebCFe23cE883","via":[]}]
    }
```

Generated with discovered.json: 0x1318dd2a0af906c783808d5fdf134705f2461b47

# Diff at Fri, 09 Aug 2024 11:58:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20317887
- current block number: 20317887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317887 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      assignedPermissions.upgrade.10:
-        "0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"
+        "0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873"
      assignedPermissions.upgrade.9:
-        "0x6B916DcCa661d23794e78509723A6f4348564847"
+        "0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"
      assignedPermissions.upgrade.8:
-        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
+        "0xa230285d5683C74935aD14c446e137c8c8828438"
      assignedPermissions.upgrade.7:
-        "0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873"
+        "0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6"
      assignedPermissions.upgrade.6:
-        "0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6"
+        "0x98078db053902644191f93988341E31289E1C8FE"
      assignedPermissions.upgrade.4:
-        "0x98078db053902644191f93988341E31289E1C8FE"
+        "0x6B916DcCa661d23794e78509723A6f4348564847"
      assignedPermissions.upgrade.3:
-        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
+        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
      assignedPermissions.upgrade.2:
-        "0xa230285d5683C74935aD14c446e137c8c8828438"
+        "0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9"
      assignedPermissions.upgrade.0:
-        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
+        "0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb"
    }
```

Generated with discovered.json: 0xe370735166d156dbd90132dc22198e3271d71f0c

# Diff at Fri, 09 Aug 2024 10:08:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20317887
- current block number: 20317887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317887 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb","0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115","0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","0x697402166Fbf2F22E970df8a6486Ef171dbfc524","0x6B916DcCa661d23794e78509723A6f4348564847","0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76","0x98078db053902644191f93988341E31289E1C8FE","0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6","0xa230285d5683C74935aD14c446e137c8c8828438","0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975","0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873"]
      assignedPermissions.owner:
-        ["0xE064B565Cf2A312a3e66Fe4118890583727380C0"]
      assignedPermissions.upgrade:
+        ["0x697402166Fbf2F22E970df8a6486Ef171dbfc524","0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115","0xa230285d5683C74935aD14c446e137c8c8828438","0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb","0x98078db053902644191f93988341E31289E1C8FE","0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76","0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6","0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873","0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9","0x6B916DcCa661d23794e78509723A6f4348564847","0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975"]
      assignedPermissions.configure:
+        ["0xE064B565Cf2A312a3e66Fe4118890583727380C0"]
    }
```

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x6520ad883d3D76f0120443c72AD7463cab2439a4","0x480Ea8bA8De8d05A30F4f4CBedE1e28E05aE1B2C","0xf97eC9b92Efda3afe52945B4e9adE0394C9E705d","0xAb5972612e8CEe66f246feaCB8D500DF3C6cfADA","0x2cF48F69a61261e67e3317D28Cf0EdD1aCAfA03d"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x6520ad883d3D76f0120443c72AD7463cab2439a4","0x480Ea8bA8De8d05A30F4f4CBedE1e28E05aE1B2C","0xf97eC9b92Efda3afe52945B4e9adE0394C9E705d","0xAb5972612e8CEe66f246feaCB8D500DF3C6cfADA","0x2cF48F69a61261e67e3317D28Cf0EdD1aCAfA03d"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d"]
      assignedPermissions.upgrade:
+        ["0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x49d495DE356259458120bfd7bCB463CFb6D6c6BA","0xb7c719eB2649c1F03bFab68b0AAa35AD538a7cC8","0x1f97306039530ADB4173C3786e86fab5e6b90F41","0x6a356C0EAA560f00127Adf5108FfAf503b9f1e11","0x46e31F27Df5047D7Fad9b1E8DFFec635cF6efAcF"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x49d495DE356259458120bfd7bCB463CFb6D6c6BA","0xb7c719eB2649c1F03bFab68b0AAa35AD538a7cC8","0x1f97306039530ADB4173C3786e86fab5e6b90F41","0x6a356C0EAA560f00127Adf5108FfAf503b9f1e11","0x46e31F27Df5047D7Fad9b1E8DFFec635cF6efAcF"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x8668975cc5917b7f754d3dba2e2b0e39cc6b7e4c

# Diff at Tue, 30 Jul 2024 11:11:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20317887
- current block number: 20317887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317887 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
      fieldMeta:
+        {"insuranceFeeBips":{"severity":"MEDIUM","description":"Insurance fee taken from positive yields"}}
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      fieldMeta:
+        {"insuranceFeeBips":{"severity":"MEDIUM","description":"Insurance fee taken from positive yields"}}
    }
```

Generated with discovered.json: 0x06e5f4fa7163e9ba26f1ac71a9f5417d0f521b2c

# Diff at Tue, 16 Jul 2024 08:31:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4cebc868d0be9a9868d2842c2670f1974594c48e block: 19976249
- current block number: 20317887

## Description

A new L2OutputOracle implementation is deployed in order to change the constant FINALIZATION_PERIOD_SECONDS (challenge period) from 12 to 7 days.

## Watched changes

```diff
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76) {
    +++ description: None
      values.$implementation:
-        "0xaEbA6c3042B463DfAA6A2DFA96486D5A92186cFF"
+        "0x1C90963D451316E3DBFdD5A30354EE56C29016EB"
      values.FINALIZATION_PERIOD_SECONDS:
-        1036800
+        604800
      values.finalizationPeriodSeconds:
-        1036800
+        604800
    }
```

Generated with discovered.json: 0xffe3764813ca09ee3350871b64f6453b893cfed7

# Diff at Wed, 29 May 2024 14:56:01 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19966417
- current block number: 19976249

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19966417 (main branch discovery), not current.

```diff
    contract LaunchBridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C"
    }
```

Generated with discovered.json: 0x4aae1613d57de7e3527114f668b01cb0dba6ccf3

# Diff at Tue, 28 May 2024 05:57:09 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 19531453
- current block number: 19966417

## Description

Blast uses blobs.

## Watched changes

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.owner:
-        "0x7c4682F89313810582fb77CF6A4A388A6C77f3aF"
+        "0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05"
    }
```

Generated with discovered.json: 0x0c410f5f03c4e57c70159f8c31458a9b0ce17204

# Diff at Thu, 28 Mar 2024 08:36:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19525946
- current block number: 19531453

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19525946 (main branch discovery), not current.

```diff
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5808f9f020c28c1148c03cf988791bbb5ca41f06

# Diff at Wed, 27 Mar 2024 13:29:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@324b798e8080757ab73bc31bc6d77fb908845e40 block: 19467922
- current block number: 19525946

## Description

Blast is manually blacklisting three addresses from the depositTransaction() function in this implementation change of the OptimismPortal.

One of them is labeled 'Munchables exploiter' on etherscan.
(0x6E8836F050A315611208A5CD7e228701563D09c5, 0xc207Fa4b17cA710BA53F06fEFF56ca9d315915B7, 0xbf9ad762DBaE603BC8FC79DFD3Fb26f2b9740E87)

depositTransaction() in the OptimismPortal would allow a user to force an L2 transaction from L1 (e.g. a bridge transaction). Censoring it combined with censoring the L2 addresses from the Sequencer's side can effectively freeze the funds on L2.

The only other change is that a YIELD_CONTRACT_ADDRESS is introduced to a null address in constants.sol.

## Watched changes

```diff
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb) {
    +++ description: None
      upgradeability.implementation:
-        "0xd7bfDa9B3b014b16bada89F206607a8Ac7c6FB32"
+        "0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391"
      implementations.0:
-        "0xd7bfDa9B3b014b16bada89F206607a8Ac7c6FB32"
+        "0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391"
    }
```

## Source code changes

```diff
.../OptimismPortal/implementation/meta.txt                          | 2 +-
 .../OptimismPortal/implementation/src/L1/OptimismPortal.sol         | 6 ++++++
 .../OptimismPortal/implementation/src/libraries/Constants.sol       | 2 ++
 3 files changed, 9 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0xcfae335c90cdabe1d8ccbbe0768f35c7cebc867e

# Diff at Tue, 19 Mar 2024 09:33:27 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ed3dd09f83459eadf3704e0797de8bbf1ae98817 block: 19445792
- current block number: 19467922

## Description

The insurance fee is disabled on ETH- and USDYieldManager. This fee was taken from positive yields.

## Watched changes

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
+++ description: Insurance fee taken from positive yields
+++ severity: MEDIUM
      values.insuranceFeeBips:
-        1000
+        0
    }
```

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
+++ description: Insurance fee taken from positive yields
+++ severity: MEDIUM
      values.insuranceFeeBips:
-        1000
+        0
    }
```

Generated with discovered.json: 0xcc0da57db3780a3761dad14cb6e4147cbdcfd583

# Diff at Sat, 16 Mar 2024 06:51:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3450b932efb78f57c769514b9e5b949f63bbe612 block: 19439804
- current block number: 19445792

## Description

Values related to yield checkpoints and withdrawal queue are ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439804 (main branch discovery), not current.

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      values.getLastCheckpointId:
-        3
      values.getLastFinalizedRequestId:
-        3
    }
```

Generated with discovered.json: 0x688972e6824f5f85d707d2b62d1dc1d8931a5172

# Diff at Wed, 13 Mar 2024 09:32:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@800d2d30954e8bfb14ad062b9806c50997706541 block: 19411954
- current block number: 19425273

## Description

Ignore value changes related to queued withdrawals from the USDYieldManager as any withdrawals are generally queued.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411954 (main branch discovery), not current.

```diff
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438) {
    +++ description: None
      values.getLastRequestId:
-        3
      values.unfinalizedRequestNumber:
-        0
    }
```

Generated with discovered.json: 0x15c383d1d808622bddcc23f20acc371a66bd7a71

# Diff at Mon, 11 Mar 2024 12:49:39 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19369456
- current block number: 19411954

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      values.opStackDA:
+        {"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":false}
      values.sequencerInbox:
+        "0xFf00000000000000000000000000000000081457"
      errors:
-        {"opStackDA":"network timeout at: https://api.etherscan.io/api?module=account&action=txlist&address=0x415c8893D514F9BC5211d36eEDA4183226b84AA7&startblock=0&endblock=19369456&page=1&offset=20&sort=desc&apikey=RC2W28PYNA2EUU86RJW52W2QXDXF13EWFK","sequencerInbox":"network timeout at: https://api.etherscan.io/api?module=account&action=txlist&address=0x415c8893D514F9BC5211d36eEDA4183226b84AA7&startblock=0&endblock=19369456&page=1&offset=20&sort=desc&apikey=RC2W28PYNA2EUU86RJW52W2QXDXF13EWFK"}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19369456 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9) {
    +++ description: None
      values.opStackDA:
-        {"isSomeTxsLengthEqualToCelestiaDAExample":false}
      values.sequencerInbox:
-        "0xFf00000000000000000000000000000000081457"
      errors:
+        {"opStackDA":"network timeout at: https://api.etherscan.io/api?module=account&action=txlist&address=0x415c8893D514F9BC5211d36eEDA4183226b84AA7&startblock=0&endblock=19369456&page=1&offset=20&sort=desc&apikey=RC2W28PYNA2EUU86RJW52W2QXDXF13EWFK","sequencerInbox":"network timeout at: https://api.etherscan.io/api?module=account&action=txlist&address=0x415c8893D514F9BC5211d36eEDA4183226b84AA7&startblock=0&endblock=19369456&page=1&offset=20&sort=desc&apikey=RC2W28PYNA2EUU86RJW52W2QXDXF13EWFK"}
    }
```

Generated with discovered.json: 0xa46181ad6f33c6f53fd35605946f062d156b404c

# Diff at Tue, 05 Mar 2024 14:07:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@529206d4dcd4dd7502f78a4a18a97240a3a0211b block: 19361335
- current block number: 19369456

## Description

Added manually Yield Providers. This will have to be updated to find them automatically.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19361335 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract DSRYieldProvider (0x0733F618118bF420b6b604c969498ecf143681a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoYieldProvider (0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db)
    +++ description: None
```

Generated with discovered.json: 0x1e9f26865d3ec0429a0cda6113646e364c3281df

# Diff at Mon, 04 Mar 2024 10:56:28 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@46496e7b791dcbec71231179f69ae70b677b485e block: 19340848
- current block number: 19361335

## Description

Blast is using different Yield Providers and generally invests token deposits
to a bridge on L1. We should in the future discover different yield providers
but this will require discovery improvements. Right now the decision is made
to treat minted tokens on BLAST as externally bridged given fundamentally different
risk profile of these tokens.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19340848 (main branch discovery), not current.

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      name:
-        "Bridge"
+        "LaunchBridge"
      values.getMainnetBridge:
+        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
      values.availableBalance:
-        "5089206326412676222939"
      values.getLastCheckpointId:
-        5
      values.getLastFinalizedRequestId:
-        42
      values.getLastRequestId:
-        314
      values.getLockedBalance:
-        "7273904440000000000000"
      values.getProviderInfoAt:
-        [["0xa9a273106b6a6346a0d4fadf546958a10e831e1594b2598065098554b0f8b5d6","0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db","494025835709703704601078",0,"493983307705724120970957","494025835709703704601078","42528003979583630121"]]
      values.tokenBalance:
-        "12363110766412676222939"
      values.totalProviderValue:
-        "494025835709703704601078"
      values.totalValue:
-        "499115042036116380824017"
      values.unfinalizedRequestNumber:
-        272
    }
```

```diff
+   Status: CREATED
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Insurance (0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6)
    +++ description: None
```

Generated with discovered.json: 0xd7b5a29c6417765e76a8c2a625f2d82edd1e9d72

# Diff at Fri, 01 Mar 2024 14:14:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b9ede39955273871351ca0f0c491301537f7a861 block: 19260868
- current block number: 19340848

## Description

Mainnet launch, the config is not yet complete. Assume that the project after
this commit is in under-review state.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.isTransitionEnabled:
-        false
+        true
      values.paused:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Insurance (0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0)
    +++ description: None
```

## Source code changes

```diff
.../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/utils/Context.sol                    |   24 +
 .../blast/ethereum/.code/AddressManager/meta.txt   |    2 +
 .../AddressManager/src/legacy/AddressManager.sol   |   46 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/BlastMultisig/implementation/meta.txt    |    2 +
 .../.code/BlastMultisig/proxy/GnosisSafeProxy.sol  |  155 +++
 .../ethereum/.code/BlastMultisig/proxy/meta.txt    |    2 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/ETHYieldManager/implementation/meta.txt  |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../implementation/src/L2/Blast.sol                |  336 ++++++
 .../ETHYieldManager/implementation/src/L2/Gas.sol  |  329 ++++++
 .../implementation/src/L2/Shares.sol               |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/ETHYieldManager/proxy/meta.txt  |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../ETHYieldManager/proxy/src/libraries/Burn.sol   |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/Insurance/implementation/meta.txt        |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../Insurance/implementation/src/L2/Blast.sol      |  336 ++++++
 .../.code/Insurance/implementation/src/L2/Gas.sol  |  329 ++++++
 .../Insurance/implementation/src/L2/Shares.sol     |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   52 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/Insurance.sol               |   63 ++
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../blast/ethereum/.code/Insurance/proxy/meta.txt  |    2 +
 .../Insurance/proxy/src/L1/ResourceMetering.sol    |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../Insurance/proxy/src/libraries/Arithmetic.sol   |   28 +
 .../.code/Insurance/proxy/src/libraries/Burn.sol   |   32 +
 .../Insurance/proxy/src/libraries/Constants.sol    |   50 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   75 ++
 .../utils/introspection/ERC165Checker.sol          |  123 +++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/interfaces/IERC5267Upgradeable.sol   |   28 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/token/ERC20/ERC20Upgradeable.sol     |  377 +++++++
 .../contracts/token/ERC20/IERC20Upgradeable.sol    |   78 ++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../ERC20/extensions/IERC20PermitUpgradeable.sol   |   60 ++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../contracts/utils/CountersUpgradeable.sol        |   43 +
 .../contracts/utils/StringsUpgradeable.sol         |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../contracts/utils/math/MathUpgradeable.sol       |  339 ++++++
 .../contracts/utils/math/SignedMathUpgradeable.sol |   43 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/L1BlastBridge/implementation/meta.txt    |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../L1BlastBridge/implementation/src/L2/Blast.sol  |  336 ++++++
 .../src/L2/ERC20PermitUpgradeable.sol              |  118 ++
 .../implementation/src/L2/ERC20Rebasing.sol        |  415 +++++++
 .../L1BlastBridge/implementation/src/L2/Gas.sol    |  329 ++++++
 .../L1BlastBridge/implementation/src/L2/Shares.sol |  129 +++
 .../L1BlastBridge/implementation/src/L2/USDB.sol   |  116 ++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/L1BlastBridge.sol           |  319 ++++++
 .../src/mainnet-bridge/L2BlastBridge.sol           |   87 ++
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/USDYieldManager.sol         |   66 ++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  138 +++
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/universal/StandardBridge.sol               |  482 +++++++++
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L1BlastBridge/proxy/meta.txt    |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L1BlastBridge/proxy/src/libraries/Burn.sol     |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +
 .../src/L1/L1CrossDomainMessenger.sol              |  186 ++++
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../implementation/src/L2/Blast.sol                |  336 ++++++
 .../implementation/src/L2/Gas.sol                  |  329 ++++++
 .../implementation/src/L2/Shares.sol               |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   52 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/utils/Context.sol                    |   24 +
 .../.code/L1CrossDomainMessenger/proxy/meta.txt    |    2 +
 .../proxy/src/legacy/AddressManager.sol            |   46 +
 .../proxy/src/legacy/ResolvedDelegateProxy.sol     |   52 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC721/IERC721.sol             |  143 +++
 .../token/ERC721/extensions/IERC721Enumerable.sol  |   29 +
 .../contracts/utils/Address.sol                    |  222 ++++
 .../utils/introspection/ERC165Checker.sol          |  123 +++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/L1ERC721Bridge/implementation/meta.txt   |    2 +
 .../implementation/src/L1/L1ERC721Bridge.sol       |  105 ++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L2/L2ERC721Bridge.sol       |  122 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ERC721Bridge.sol  |  174 +++
 .../src/universal/IOptimismMintableERC721.sol      |   48 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L1ERC721Bridge/proxy/meta.txt   |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L1ERC721Bridge/proxy/src/libraries/Burn.sol    |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../L1ERC721Bridge/proxy/src/universal/Proxy.sol   |  168 +++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   75 ++
 .../utils/introspection/ERC165Checker.sol          |  123 +++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/L1StandardBridge/implementation/meta.txt |    2 +
 .../implementation/src/L1/L1StandardBridge.sol     |  338 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  138 +++
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/universal/StandardBridge.sol               |  482 +++++++++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L1StandardBridge/proxy/meta.txt |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L1StandardBridge/proxy/src/libraries/Burn.sol  |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/L2OutputOracle/implementation/meta.txt   |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L2OutputOracle/proxy/src/libraries/Burn.sol    |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../L2OutputOracle/proxy/src/universal/Proxy.sol   |  168 +++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../implementation/meta.txt                        |    2 +
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  138 +++
 .../src/universal/OptimismMintableERC20Factory.sol |  122 +++
 .../implementation/src/universal/Semver.sol        |   40 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../proxy/src/libraries/Burn.sol                   |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../proxy/src/universal/Proxy.sol                  |  168 +++
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/OptimismPortal/implementation/meta.txt   |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../OptimismPortal/implementation/src/L2/Blast.sol |  336 ++++++
 .../OptimismPortal/implementation/src/L2/Gas.sol   |  329 ++++++
 .../implementation/src/L2/Shares.sol               |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../OptimismPortal/proxy/src/libraries/Burn.sol    |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../OptimismPortal/proxy/src/universal/Proxy.sol   |  168 +++
 .../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../blast/ethereum/.code/ProxyAdmin/meta.txt       |    2 +
 .../.code/ProxyAdmin/src/L1/ResourceMetering.sol   |  162 +++
 .../.code/ProxyAdmin/src/legacy/AddressManager.sol |   46 +
 .../ProxyAdmin/src/legacy/L1ChugSplashProxy.sol    |  232 ++++
 .../.code/ProxyAdmin/src/libraries/Arithmetic.sol  |   28 +
 .../.code/ProxyAdmin/src/libraries/Burn.sol        |   32 +
 .../.code/ProxyAdmin/src/libraries/Constants.sol   |   50 +
 .../.code/ProxyAdmin/src/universal/Proxy.sol       |  168 +++
 .../.code/ProxyAdmin/src/universal/ProxyAdmin.sol  |  203 ++++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/SystemConfig/implementation/meta.txt     |    2 +
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/SystemConfig/proxy/meta.txt     |    2 +
 .../SystemConfig/proxy/src/L1/ResourceMetering.sol |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../SystemConfig/proxy/src/libraries/Burn.sol      |   32 +
 .../SystemConfig/proxy/src/libraries/Constants.sol |   50 +
 .../SystemConfig/proxy/src/universal/Proxy.sol     |  168 +++
 537 files changed, 82096 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19260868 (main branch discovery), not current.

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.getMainnetBridge:
-        "EXPECT_REVERT"
    }
```

Generated with discovered.json: 0x73efb82f36e49271fe84dbc69b985b3c4af9f14f

# Diff at Mon, 19 Feb 2024 09:23:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0a522442e2dd6f9a3312ee296e595da0691fa23a block: 18771421
- current block number: 19260868

## Description

The implementation is upgraded. See Diff below for the changes.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      upgradeability.implementation:
-        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
+        "0x0bD88b59D580549285f0A207Db5F06bf24a8e561"
      implementations.0:
-        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
+        "0x0bD88b59D580549285f0A207Db5F06bf24a8e561"
      values.proposedBridgeReadyAt:
-        0
      values.proposedMainnetBridge:
-        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgrade:
-        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgradeReadyAt:
-        0
    }
```

## Source code changes

```diff
.../contracts/token/ERC20/IERC20.sol               |   8 +-
 .../ERC20/extensions/IERC20Permit.sol => /dev/null |  60 -------
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  58 ++++++-
 .../Bridge/implementation/meta.txt                 |   2 +-
 .../Bridge/implementation/src/LaunchBridge_v3.sol} | 179 +++++++--------------
 .../implementation/src/libraries/Predeploys.sol    |  95 +++++++++++
 6 files changed, 215 insertions(+), 187 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18771421 (main branch discovery), not current.

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      values.getMainnetBridge:
+        "EXPECT_REVERT"
    }
```

Generated with discovered.json: 0xe9cebe22717eca176ca67be9ef1b813fd5ffaa20

# Diff at Tue, 12 Dec 2023 16:53:48 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@695bd005662e55af5dd20ff984779cea92a8a968

## Description

Change in the Bridge implementation. A 24h timelock is introduced on Admin Proxy updates and Bridge Transition updates. The update proposals can be created by the owner and canceled by the owner if not executed yet. Updates that do not go through the timelock will now revert.

Users can now withdraw in two cases:

- While there is an active proposal for upgrade/transition. In that case users will lose their points.
- After the contract has expired (currently set to 1 June 2024)

Other changes: The \_moveETH and \_moveUSD functions are refactored to return the assets value (previously executing the transfer), the actual transfer to the new bridge is now done within the transition function.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      upgradeability.implementation:
-        "0xa01Def05A37850b2e13C8c839AA268845Df14276"
+        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
      implementations.0:
-        "0xa01Def05A37850b2e13C8c839AA268845Df14276"
+        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
      values.proposedBridgeReadyAt:
+        0
      values.proposedMainnetBridge:
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgrade:
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgradeReadyAt:
+        0
    }
```

## Source code changes

```diff
.../Bridge/implementation/meta.txt                 |   2 +-
 .../src/launch-bridge}/LaunchBridge.sol            | 178 ++++++++++++++++++---
 2 files changed, 161 insertions(+), 19 deletions(-)
```

# Diff at Mon, 04 Dec 2023 15:05:33 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@982648829699454aa19300c012f060616045a3f0

## Description

Change in BridgeOwner (multisig) owners.

## Watched changes

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
      values.getOwners.0:
-        "0x59cDa1e234505D460c972e58452c0A6d8e14a5Ce"
+        "0x49d495DE356259458120bfd7bCB463CFb6D6c6BA"
    }
```

# Diff at Tue, 21 Nov 2023 08:08:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    }
```

```diff
+   Status: CREATED
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    }
```
