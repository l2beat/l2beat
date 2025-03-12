Generated with discovered.json: 0xc0a062ecfcc77961ef5a05a7af182b67ed97bdfd

# Diff at Tue, 04 Mar 2025 10:39:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21716626
- current block number: 21716626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      sinceBlock:
+        20996843
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      sinceBlock:
+        20996854
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      sinceBlock:
+        20996776
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      sinceBlock:
+        20996821
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      sinceBlock:
+        20996858
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      sinceBlock:
+        21664323
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      sinceBlock:
+        20996850
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sinceBlock:
+        20996846
    }
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      sinceBlock:
+        21020988
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      sinceBlock:
+        20996899
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      sinceBlock:
+        20996813
    }
```

```diff
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154) {
    +++ description: Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0.
      sinceBlock:
+        21614228
    }
```

```diff
    contract MorphUpgradeMultisig (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      sinceBlock:
+        21135313
    }
```

```diff
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984) {
    +++ description: Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.
      sinceBlock:
+        20998580
    }
```

Generated with discovered.json: 0x003aaa7a46d1f310931c353ed8f8597f22930574

# Diff at Tue, 04 Feb 2025 12:31:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21716626
- current block number: 21716626

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.31.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x14f7cc719378d2cf73df1be47f04f33e7e46a592

# Diff at Mon, 27 Jan 2025 15:02:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21678881
- current block number: 21716626

## Description

new templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678881 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      template:
+        "global/ProxyAdmin"
    }
```

Generated with discovered.json: 0x7479eba0469174faed82a2293c6ad1775a6ad1ef

# Diff at Wed, 22 Jan 2025 10:04:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21667783
- current block number: 21678881

## Description

New verifier, new Proxyadmin owner MS.

MultipleVersionRollupVerifier (verifier router) has minimal changes.

ZkEvmVerifierV1 (the actual verifier) is code-identical with the previous one.

## Watched changes

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions.7.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
-   Status: DELETED
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e)
    +++ description: None
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.32.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
      values.verifier:
-        "0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6"
+        "0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1"
    }
```

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6)
    +++ description: None
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"0x0Dc417F8AF88388737c5053FF73f345f080543F7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.1.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154)
    +++ description: Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0.
```

```diff
+   Status: CREATED
    contract MorphUpgradeMultisig (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/MorphUpgradeMultisig/Safe.sol   | 1088 ++++++++++++++++++++
 .../.flat/MorphUpgradeMultisig/SafeProxy.p.sol     |   37 +
 .../MultipleVersionRollupVerifier.sol              |   13 +-
 3 files changed, 1137 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21667783 (main branch discovery), not current.

```diff
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e) {
    +++ description: None
      description:
-        "Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0."
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6) {
    +++ description: None
      description:
-        "Used to update the verifier and keep track of current and old versions."
      values.latestVerifier.4:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.3:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.2:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.1:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.0:
-        {"startBatchIndex":0,"verifier":"0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e"}
+        [0,"0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e"]
      values.legacyVerifiersLength.4:
+        0
      values.legacyVerifiersLength.3:
+        0
      values.legacyVerifiersLength.2:
+        0
      values.legacyVerifiersLength.1:
+        0
      values.verifierVersions:
-        [0]
      errors:
+        {"latestVerifier":"Processing error occurred.","legacyVerifiersLength":"Processing error occurred."}
    }
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      name:
-        "MorphAdminMSig"
+        "MorphOpsMultisig"
    }
```

Generated with discovered.json: 0x72f1722fef77263dbdc89f0ae4a67e13359d4916

# Diff at Mon, 20 Jan 2025 19:26:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3a16743af72fb4c941689b26d336a59661143f06 block: 21465401
- current block number: 21667783

## Description

Upgrades to MorphRollup, L1MessageQueueWithGasPriceOracle, L1CrossDomainMessenger to **deprecate skipping / dropping messages from the queue**.

There is no enforcement of the processing of the queue. 

The EnforcedTxGateway is still paused (It is, apart from the L1CrossDomainMessenger, the only address that can append messages to the L1MessageQueue) and thus queuing transactions is currently not possible.

Some Challengers are apparently run by bitget / bitget wallet.

## Watched changes

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      sourceHashes.1:
-        "0xe43c8aca9b520edaff0a7339959cee77a47b241a07c6d0dd9836e466caf35e72"
+        "0x1719cdcf5cd2921747ddc6f0dea1d383d56e48c613a99782597914a32d40e4cd"
      values.$implementation:
-        "0x828F68e2E05a34fA836416F124350E25021876ac"
+        "0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"
      values.$pastUpgrades.2:
+        ["2025-01-13T08:11:59.000Z","0x60cc38cb058516da361ecd5f548fc9216fbcda9eb08255b529ebbf78dac44f7b",["0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"]]
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sourceHashes.1:
-        "0x2b50f40d48451dfa5ae761371d1c0b18c8c827b34d17c401f629bc743888721e"
+        "0xdbd7245a43b9bfda69e999525405cc2d3a44e2a5d60c8fcbc75bb2d4987837be"
      values.$implementation:
-        "0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"
+        "0x43190DfD1F572Cb56B1942B44482d1774151D77A"
      values.$pastUpgrades.4:
+        ["2025-01-13T07:31:59.000Z","0x809b1d9bba9fd8f61c038603ddf7a6f0a079db83a4a6d341cf23d2af5764a9be",["0x43190DfD1F572Cb56B1942B44482d1774151D77A"]]
      values.$upgradeCount:
-        4
+        5
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      sourceHashes.1:
-        "0x1a0a7d2a0ed1f83c7043abd7a9f1f24c979e7e86e258c7968ed007894fbf2a4a"
+        "0xdddbb6a01d10a0241f53955182f6b04e5ee4ec2561e412672adae6aa9177fd49"
      values.$implementation:
-        "0xB8F0871bc0832cb756f07fFC4bDdC8b6bf8577b5"
+        "0x0cC37d5239F9027A1269f53D83c73084D538f3a9"
      values.$pastUpgrades.2:
+        ["2025-01-13T08:10:23.000Z","0x908d9fce8cd9a787900543daabf45936a8873b543f593030f3edceeca35543f8",["0x0cC37d5239F9027A1269f53D83c73084D538f3a9"]]
      values.$upgradeCount:
-        2
+        3
    }
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     |  71 +-------------
 .../L1MessageQueueWithGasPriceOracle.sol           |  75 ++------------
 .../MorphRollup/Rollup.sol                         | 108 +++------------------
 3 files changed, 23 insertions(+), 231 deletions(-)
```

Generated with discovered.json: 0x4b1155ee8d29fc6ba304940cc3148b73d7aa5d5e

# Diff at Mon, 20 Jan 2025 11:09:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465401
- current block number: 21465401

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465401 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions.7.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.7.via.0.delay:
-        0
      issuedPermissions.7.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.6.target:
-        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
      issuedPermissions.6.to:
+        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
      issuedPermissions.6.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.5.target:
-        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      issuedPermissions.5.to:
+        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      issuedPermissions.5.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.4.target:
-        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
      issuedPermissions.4.to:
+        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
      issuedPermissions.4.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.3.target:
-        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      issuedPermissions.3.to:
+        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      issuedPermissions.3.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.2.target:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      issuedPermissions.2.to:
+        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      issuedPermissions.2.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.1.target:
-        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
      issuedPermissions.1.to:
+        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
      issuedPermissions.1.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.0.target:
-        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      issuedPermissions.0.to:
+        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      issuedPermissions.0.description:
+        "Actors allowed to commit transaction batches and propose state roots"
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      directlyReceivedPermissions.7.from:
+        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      directlyReceivedPermissions.6.target:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      directlyReceivedPermissions.6.from:
+        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      directlyReceivedPermissions.5.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.5.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.4.target:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      directlyReceivedPermissions.4.from:
+        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      directlyReceivedPermissions.3.target:
-        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      directlyReceivedPermissions.3.from:
+        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      directlyReceivedPermissions.2.target:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      directlyReceivedPermissions.2.from:
+        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      directlyReceivedPermissions.1.target:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      directlyReceivedPermissions.1.from:
+        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      directlyReceivedPermissions.0.target:
-        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      directlyReceivedPermissions.0.from:
+        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.32.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.32.via.0.delay:
-        0
      issuedPermissions.32.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.31.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.31.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.31.description:
+        "can pause and unpause, override any batch, revert batch, update proof window, update challengers, modify verifiers"
      issuedPermissions.30.target:
-        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      issuedPermissions.30.to:
+        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      issuedPermissions.29.target:
-        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      issuedPermissions.29.to:
+        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      issuedPermissions.28.target:
-        "0xF2FF0509520fAf35B511074466A509e00d73C307"
      issuedPermissions.28.to:
+        "0xF2FF0509520fAf35B511074466A509e00d73C307"
      issuedPermissions.27.target:
-        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      issuedPermissions.27.to:
+        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      issuedPermissions.26.target:
-        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      issuedPermissions.26.to:
+        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      issuedPermissions.25.target:
-        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      issuedPermissions.25.to:
+        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      issuedPermissions.24.target:
-        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      issuedPermissions.24.to:
+        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      issuedPermissions.23.target:
-        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      issuedPermissions.23.to:
+        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      issuedPermissions.22.target:
-        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
      issuedPermissions.22.to:
+        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
      issuedPermissions.21.target:
-        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
      issuedPermissions.21.to:
+        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
      issuedPermissions.20.target:
-        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      issuedPermissions.20.to:
+        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      issuedPermissions.19.target:
-        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      issuedPermissions.19.to:
+        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      issuedPermissions.18.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.18.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.17.target:
-        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      issuedPermissions.17.to:
+        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      issuedPermissions.16.target:
-        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      issuedPermissions.16.to:
+        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      issuedPermissions.15.target:
-        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      issuedPermissions.15.to:
+        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      issuedPermissions.14.target:
-        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      issuedPermissions.14.to:
+        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      issuedPermissions.13.target:
-        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      issuedPermissions.13.to:
+        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      issuedPermissions.12.target:
-        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      issuedPermissions.12.to:
+        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      issuedPermissions.11.target:
-        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
      issuedPermissions.11.to:
+        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
      issuedPermissions.10.target:
-        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      issuedPermissions.10.to:
+        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      issuedPermissions.9.target:
-        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      issuedPermissions.9.to:
+        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      issuedPermissions.8.target:
-        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      issuedPermissions.8.to:
+        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      issuedPermissions.7.target:
-        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      issuedPermissions.7.to:
+        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      issuedPermissions.6.target:
-        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      issuedPermissions.6.to:
+        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      issuedPermissions.5.target:
-        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      issuedPermissions.5.to:
+        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      issuedPermissions.4.target:
-        "0x323a78C1c910b282dE98a557d735628A02E00983"
      issuedPermissions.4.to:
+        "0x323a78C1c910b282dE98a557d735628A02E00983"
      issuedPermissions.3.target:
-        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      issuedPermissions.3.to:
+        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      issuedPermissions.2.target:
-        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      issuedPermissions.2.to:
+        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      issuedPermissions.1.target:
-        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      issuedPermissions.1.to:
+        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      issuedPermissions.0.target:
-        "0x0092bC49078f130D27e70dBeee441E227280B97D"
      issuedPermissions.0.to:
+        "0x0092bC49078f130D27e70dBeee441E227280B97D"
    }
```

```diff
    contract MorphAdminMSig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      receivedPermissions.10.from:
+        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      receivedPermissions.9.target:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.9.from:
+        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.8.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.8.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.7.target:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      receivedPermissions.7.from:
+        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      receivedPermissions.6.target:
-        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      receivedPermissions.6.from:
+        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      receivedPermissions.5.target:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      receivedPermissions.5.from:
+        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      receivedPermissions.4.target:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      receivedPermissions.4.from:
+        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      receivedPermissions.3.target:
-        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      receivedPermissions.3.from:
+        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      receivedPermissions.2.target:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.2.from:
+        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.1.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.1.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.0.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.0.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      directlyReceivedPermissions.0.from:
+        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.1.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.description:
+        "can pause and unpause"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

Generated with discovered.json: 0x872bba178066c728ee915ae4b9a306c43c356364

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
