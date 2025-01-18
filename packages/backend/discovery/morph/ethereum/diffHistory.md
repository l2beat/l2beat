Generated with discovered.json: 0x64a8a841ac666e08988b629b27f536f1dcc4f353

# Diff at Sat, 18 Jan 2025 16:51:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@400cfe1ca700b8b710220906f278f002c698d3c8 block: 21465401
- current block number: 21465401

## Description

Added new ProxyAdmin shape.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465401 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      template:
+        "global/ProxyAdmin"
    }
```

Generated with discovered.json: 0x2591eb0e4fbd08ad6c30f25e6cfddda2cd92d0eb

# Diff at Mon, 23 Dec 2024 13:12:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21285500
- current block number: 21465401

## Description

~30 Challengers added.

## Watched changes

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.32:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.31:
+        {"permission":"configure","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]}
      issuedPermissions.30:
+        {"permission":"challenge","target":"0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd","via":[]}
      issuedPermissions.29:
+        {"permission":"challenge","target":"0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9","via":[]}
      issuedPermissions.28:
+        {"permission":"challenge","target":"0xF2FF0509520fAf35B511074466A509e00d73C307","via":[]}
      issuedPermissions.27:
+        {"permission":"challenge","target":"0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe","via":[]}
      issuedPermissions.26:
+        {"permission":"challenge","target":"0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272","via":[]}
      issuedPermissions.25:
+        {"permission":"challenge","target":"0xd11f9c4F5d9b1feC2d14581d3674066442B68772","via":[]}
      issuedPermissions.24:
+        {"permission":"challenge","target":"0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0","via":[]}
      issuedPermissions.23:
+        {"permission":"challenge","target":"0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8","via":[]}
      issuedPermissions.22:
+        {"permission":"challenge","target":"0xC4db900F76293042349448D1Ba30F71518325Bb3","via":[]}
      issuedPermissions.21:
+        {"permission":"challenge","target":"0xC412B4e6399F694CfF21D038d225373Fd6596811","via":[]}
      issuedPermissions.20:
+        {"permission":"challenge","target":"0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C","via":[]}
      issuedPermissions.19:
+        {"permission":"challenge","target":"0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab","via":[]}
      issuedPermissions.18:
+        {"permission":"challenge","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]}
      issuedPermissions.17:
+        {"permission":"challenge","target":"0xb4A20D473e8C378aE742a8017DD67756a358eAB6","via":[]}
      issuedPermissions.16:
+        {"permission":"challenge","target":"0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b","via":[]}
      issuedPermissions.15:
+        {"permission":"challenge","target":"0x95C373754C66feF1Eb2dbb6934aF821C551D9738","via":[]}
      issuedPermissions.14:
+        {"permission":"challenge","target":"0x95417708f67f4a5dF1A447efe40c6C74e38Ab832","via":[]}
      issuedPermissions.13:
+        {"permission":"challenge","target":"0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb","via":[]}
      issuedPermissions.12:
+        {"permission":"challenge","target":"0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd","via":[]}
      issuedPermissions.11:
+        {"permission":"challenge","target":"0x77B29534738E3F0F297d36635d7884965C7c8cE1","via":[]}
      issuedPermissions.10:
+        {"permission":"challenge","target":"0x74204e3801E9394848AbDBAd6f378d0b11e9a091","via":[]}
      issuedPermissions.9:
+        {"permission":"challenge","target":"0x71C10870dC38E54d987C22e96aB32b46cc08564F","via":[]}
      issuedPermissions.8:
+        {"permission":"challenge","target":"0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854","via":[]}
      issuedPermissions.7:
+        {"permission":"challenge","target":"0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db","via":[]}
      issuedPermissions.6:
+        {"permission":"challenge","target":"0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e","via":[]}
      issuedPermissions.5:
+        {"permission":"challenge","target":"0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C","via":[]}
      issuedPermissions.4:
+        {"permission":"challenge","target":"0x323a78C1c910b282dE98a557d735628A02E00983","via":[]}
      issuedPermissions.3:
+        {"permission":"challenge","target":"0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0","via":[]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.2.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      issuedPermissions.2.via.0:
-        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      issuedPermissions.1.permission:
-        "configure"
+        "challenge"
      issuedPermissions.1.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0x0092bC49078f130D27e70dBeee441E227280B97D"
      values.challengers.30:
+        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      values.challengers.29:
+        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      values.challengers.28:
+        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      values.challengers.27:
+        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      values.challengers.26:
+        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      values.challengers.25:
+        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      values.challengers.24:
+        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      values.challengers.23:
+        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
      values.challengers.22:
+        "0x0092bC49078f130D27e70dBeee441E227280B97D"
      values.challengers.21:
+        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      values.challengers.20:
+        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      values.challengers.19:
+        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      values.challengers.18:
+        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      values.challengers.17:
+        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      values.challengers.16:
+        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      values.challengers.15:
+        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      values.challengers.14:
+        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      values.challengers.13:
+        "0xF2FF0509520fAf35B511074466A509e00d73C307"
      values.challengers.12:
+        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
      values.challengers.11:
+        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      values.challengers.10:
+        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      values.challengers.9:
+        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      values.challengers.8:
+        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      values.challengers.7:
+        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      values.challengers.6:
+        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      values.challengers.5:
+        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      values.challengers.4:
+        "0x323a78C1c910b282dE98a557d735628A02E00983"
      values.challengers.3:
+        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      values.challengers.2:
+        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      values.challengers.1:
+        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
    }
```

Generated with discovered.json: 0x251bd3fc5a694cc0afc4aaf27f0eec9430eefb52

# Diff at Thu, 28 Nov 2024 10:07:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cba708dac9336030203b425721a33c9db2b14313 block: 21272621
- current block number: 21285500

## Description

Minor upgrade of MorphRollup introducing `committedStateRoots`, a mapping that delivers what it promises. Before there was only a finalizedStateRoots mapping.

This upgrade also adds back the require in `importGenesisBatch()` which prevents calling the function in case the genesis batch is already imported.

## Watched changes

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sourceHashes.1:
-        "0xb1afd290858bf0702793a7fd0a214fc9c1c0aa70ff5755193bdd20073e5d0ca1"
+        "0x2b50f40d48451dfa5ae761371d1c0b18c8c827b34d17c401f629bc743888721e"
      values.$implementation:
-        "0x073403E147a8e607b80985fe458c0B527287278F"
+        "0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"
      values.$pastUpgrades.3:
+        ["2024-11-28T03:51:59.000Z","0xa452e20183f6860f105cb398bccc9d75dd3758444b956061b3031d1f0a33c424",["0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"]]
      values.$upgradeCount:
-        3
+        4
    }
```

## Source code changes

```diff
.../MorphRollup/Rollup.sol                         | 29 +++++++++++++++++-----
 1 file changed, 23 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x3040bc3142e7ed49d847e3c57d67f3fa373616d0

# Diff at Tue, 26 Nov 2024 14:48:58 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@870cd1dcc81bc3cf8bef8fe79c76929e42c7c886 block: 21264263
- current block number: 21272621

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21264263 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions.7:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.6:
+        {"permission":"sequence","target":"0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23","via":[]}
      issuedPermissions.5:
+        {"permission":"sequence","target":"0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80","via":[]}
      issuedPermissions.4:
+        {"permission":"sequence","target":"0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7","via":[]}
      issuedPermissions.3:
+        {"permission":"sequence","target":"0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65","via":[]}
      issuedPermissions.2:
+        {"permission":"sequence","target":"0x6aB0E960911b50f6d14f249782ac12EC3E7584A0","via":[]}
      issuedPermissions.1:
+        {"permission":"sequence","target":"0x61F2945d4bc9E40B66a6376d1094a50438f613e2","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      description:
+        "Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented)."
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contract used to bridge ETH from L1 to L2."
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0Dc417F8AF88388737c5053FF73f345f080543F7"},{"permission":"upgrade","target":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"},{"permission":"upgrade","target":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"},{"permission":"upgrade","target":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"},{"permission":"upgrade","target":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"},{"permission":"upgrade","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"},{"permission":"upgrade","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"},{"permission":"upgrade","target":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0Dc417F8AF88388737c5053FF73f345f080543F7"},{"permission":"upgrade","target":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"},{"permission":"upgrade","target":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"},{"permission":"upgrade","target":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"},{"permission":"upgrade","target":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"},{"permission":"upgrade","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"},{"permission":"upgrade","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"},{"permission":"upgrade","target":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"}]
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway."
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list."
    }
```

```diff
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e) {
    +++ description: Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0.
      description:
+        "Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0."
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway."
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.1:
+        {"permission":"configure","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      description:
+        "The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist."
    }
```

```diff
    contract MorphAdminMSig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"challenge","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"},{"permission":"configure","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60","description":"can pause and unpause, override any batch, revert batch, update proof window, update challengers, modify verifiers"},{"permission":"configure","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7","description":"can pause and unpause"},{"permission":"upgrade","target":"0x0Dc417F8AF88388737c5053FF73f345f080543F7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      description:
+        "Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true."
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender."
    }
```

```diff
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984) {
    +++ description: Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.
      description:
+        "Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1."
    }
```

Generated with discovered.json: 0x56f6b20b52991cc5411b3c1be7d76e32754c863d

# Diff at Mon, 25 Nov 2024 10:45:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21236006
- current block number: 21264263

## Description

EnforcedTxGateway paused after our nudge on twitter.

## Watched changes

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x770c6ce5d96d0b1315ca7492b36eb7b735e8611e

# Diff at Thu, 21 Nov 2024 12:08:57 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 21236006

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract MorphAdminMSig (0xB822319ab7848b7cC4537c8409e50f85BFb04377)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984)
    +++ description: None
```
