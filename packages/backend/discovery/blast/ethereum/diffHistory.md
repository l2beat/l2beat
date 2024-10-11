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
