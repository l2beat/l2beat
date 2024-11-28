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
