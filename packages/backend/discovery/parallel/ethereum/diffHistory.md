Generated with discovered.json: 0xe3d0d6d996e6fdd3690509e7e92e0ab82ace65b9

# Diff at Fri, 30 Aug 2024 07:54:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20539980
- current block number: 20539980

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
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
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x1dfd8b37479f560f094449e283d0a9f0aac33b1a

# Diff at Fri, 23 Aug 2024 09:54:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20539980
- current block number: 20539980

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xdda61d1a155212fa60df4e0d224f59446d09bb28

# Diff at Wed, 21 Aug 2024 10:04:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20539980
- current block number: 20539980

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","0x5D657b905275F36AD62C3d5C36966975613aFB96","0x5a961c7D162195a9Dc5a357Cc168b0694283382E","0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","0xa1c86E2362dba0525075622af6d5f739B1304D45","0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","via":[]},{"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","via":[]},{"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","via":[]},{"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","via":[]},{"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E","via":[]},{"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96","via":[]},{"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","via":[]},{"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45","via":[]},{"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8","via":[]},{"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","via":[]},{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877","via":[]}]
    }
```

Generated with discovered.json: 0x988841d109efe1870589b323c698b053c09d834f

# Diff at Fri, 16 Aug 2024 08:25:27 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@7273b1decf2b7a03e4f10ec7b42f94fa80b3c5ba block: 20511119
- current block number: 20539980

## Description

The futureBlocks value enforces a max block height that a batch can be posted relative to the current block (likewise with futureSeconds). A small value for future blocks means that a relatively small L1 reorg can cause an otherwise valid batch to revert. They increased is to 96, or three epochs. The futureSeconds value is set to correspond to the new futureBlocks value. The delay is also changed - it's the delay time between tx submission and ability to do force inclusion on the L1. Compared to Arbitrum One all of the delays are higher here.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.maxTimeVariation.delayBlocks:
-        5760
+        11520
      values.maxTimeVariation.futureBlocks:
-        48
+        96
      values.maxTimeVariation.delaySeconds:
-        86400
+        172800
      values.maxTimeVariation.futureSeconds:
-        3600
+        7200
    }
```

Generated with discovered.json: 0x9da8d6602f5bc8018ec9a4e1c2db4df4e1a2ec4c

# Diff at Mon, 12 Aug 2024 07:44:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@78984bd9166a6a2ef87dc311b2392c9536e24795 block: 20475140
- current block number: 20511119

## Description

Parallel is posting blobs again, for some reason they switched to calldata a while ago but they are back to blobs now.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.postsBlobs:
-        false
+        true
    }
```

Generated with discovered.json: 0xcbf2f32feebbf2f97fa124b0bc96bcd11183af12

# Diff at Fri, 09 Aug 2024 12:01:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20475140
- current block number: 20475140

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475140 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      assignedPermissions.upgrade.8:
-        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      assignedPermissions.upgrade.7:
-        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
+        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      assignedPermissions.upgrade.6:
-        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
+        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      assignedPermissions.upgrade.5:
-        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
+        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      assignedPermissions.upgrade.3:
-        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
+        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      assignedPermissions.upgrade.2:
-        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
+        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      assignedPermissions.upgrade.1:
-        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
+        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      assignedPermissions.upgrade.0:
-        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
+        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
    }
```

Generated with discovered.json: 0x56dc3e54b9d63be5f7b93cdb889a811be10e81be

# Diff at Fri, 09 Aug 2024 10:11:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475140
- current block number: 20475140

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475140 (main branch discovery), not current.

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xb6559478b59836376dA9937c4C697dDb21779E49","0x9EBe5cabad9748263DbE1304064AdAb285c0f515","0x17816E9A858b161c3E37016D139cf618056CaCD4","0x0049FAB7f5dD1F26F057BD5d972Ffc6ba3c349Dd","0x909e36B512Ed45250fdff513523119d825647695"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xb6559478b59836376dA9937c4C697dDb21779E49","0x9EBe5cabad9748263DbE1304064AdAb285c0f515","0x17816E9A858b161c3E37016D139cf618056CaCD4","0x0049FAB7f5dD1F26F057BD5d972Ffc6ba3c349Dd","0x909e36B512Ed45250fdff513523119d825647695"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","0x5D657b905275F36AD62C3d5C36966975613aFB96","0x5a961c7D162195a9Dc5a357Cc168b0694283382E","0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","0xa1c86E2362dba0525075622af6d5f739B1304D45","0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"]
      assignedPermissions.upgrade:
+        ["0xa1c86E2362dba0525075622af6d5f739B1304D45","0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","0x5a961c7D162195a9Dc5a357Cc168b0694283382E","0x5D657b905275F36AD62C3d5C36966975613aFB96","0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"]
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"]
      assignedPermissions.upgrade:
+        ["0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"]
    }
```

Generated with discovered.json: 0xfd62887005a3835fad303d8d0fc8ae3fc92ff078

# Diff at Wed, 07 Aug 2024 07:16:47 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20469265
- current block number: 20475140

## Description

New batch poster address is added.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.batchPosters.1:
+        "0x7a6BD06483710252d807bE205255E69490efca3A"
      values.setIsBatchPosterCount:
-        3
+        4
    }
```

Generated with discovered.json: 0x92bed3f93bb7b3a89690079407db0bd44b17e955

# Diff at Tue, 06 Aug 2024 11:35:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@636940e9998601360990d4bbb59e5d257345bee1 block: 20454427
- current block number: 20469265

## Description

Conduit multisig is removed from permissions and replaced by an EOA. The single validator is replaced.
There is one batch posted with calldata and the Sequencer only window is increased and then reset again to the old value. (`maxTimeVariation.delaySeconds`)
The wasmModuleRoot is changed to the ArbOS 31 root. ([compare Nitro GH repo](https://github.com/OffchainLabs/nitro/blob/7defbd2f59ffc53229eddaa5d6588e1a81ed90ff/Dockerfile#L220))

## Watched changes

```diff
-   Status: DELETED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.lastStakeBlock:
-        18914041
+        20468408
      values.setValidatorCount:
-        1
+        2
      values.stakerCount:
-        1
+        2
      values.validators.0:
-        "0x56D33424edb428744597Ec02571f14B50a33b7de"
+        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.batchPosters.0:
-        "0x5eAD389b57d533A94a0eacd570Dc1CC59C25F2D4"
+        "0x40acDc94a00b33151B40763b3Fed7C46fF639Df4"
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        true
+        false
      values.postsBlobs:
-        true
+        false
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.2:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
+        "0x7AC5Af3cb1F05aC5301E5589e8bE097247C5456b"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

## Source code changes

```diff
.../ConduitMultisig/GnosisSafe.sol => /dev/null    | 952 ---------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |  34 -
 2 files changed, 986 deletions(-)
```

Generated with discovered.json: 0x81a29071fa30ab118e27cf7bf790151320c2728c

# Diff at Sun, 04 Aug 2024 09:55:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20324735
- current block number: 20454427

## Description

A second Multisig is added as UpgradeExecutor.
Furthermore, the UpgradeExecutor was EOA-governed since Jan 2024 by `0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C`.

## Watched changes

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.2:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
+   Status: CREATED
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/ParallelMultisig/GnosisSafe.sol | 952 +++++++++++++++++++++
 .../.flat/ParallelMultisig/GnosisSafeProxy.p.sol   |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xa983c9d48afcdea5e41c24942fc90aaf13668f51

# Diff at Tue, 30 Jul 2024 11:13:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20324735
- current block number: 20324735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324735 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x4d5085741f2009ce78422ded5a756a7c74b2e406

# Diff at Wed, 17 Jul 2024 07:24:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f46e1b9319335587ca32b6e85f9d2f0c7ab7a729 block: 20177357
- current block number: 20324735

## Description

Use the new handler to check if it's posting blobs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177357 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.postsBlobs:
+        true
    }
```

Generated with discovered.json: 0x9a0d2512e77fef680460ede048f4a59c646bd608

# Diff at Wed, 26 Jun 2024 08:15:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1ee82e236b3e4d3c84f7f57d45b355aba70df5e7 block: 19927721
- current block number: 20174601

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927721 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x50dc4b63edf931cc0b129c091769d15c9d631876

# Diff at Wed, 22 May 2024 20:11:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918791
- current block number: 19927721

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x3b4a0f59eae8e09d6bb2504085ccc013ca253e95

# Diff at Tue, 21 May 2024 14:11:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19883602
- current block number: 19918791

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19883602 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "OwnerMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x9499a161dab92924ef2ab20a6556f1aa1fc54d83

# Diff at Thu, 02 May 2024 08:17:10 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 19630573
- current block number: 19781186

## Description

The implementation of SequencerInbox was upgraded to a differenct contract with identical code.
This was done to change the immutable boolean `isUsingFeeToken` to false. This immutable should indeed be false on ethereum mainnet as it signifies the base L1 using a custom fee token. (Used as a check for `submitBatchSpendingReport()` function that is needed for fee sequencer fee reimbursement)

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      upgradeability.implementation:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      implementations.0:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.isUsingFeeToken:
-        true
+        false
    }
```

## Source code changes

```diff
.../{.code@19630573 => .code}/SequencerInbox/implementation/meta.txt    | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x40ee005b1b236066f02ef1c4a0f5dfd9252b45d3

# Diff at Thu, 11 Apr 2024 06:24:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@379d5924e19a3a6dfc1858baca3e1ce1c43bfe6f block: 19532058
- current block number: 19630573

## Description

### New deploys

OneStepProofEntry, OneStepProverHostIo, OneStepProverMath, OneStepProver0, OneStepProverMemory are redeployed and Reader4844 is added to be compatible with EIP-4844.

- OneStepProverHostIo: Compatibility with EIP-4844, most updates are KZG-related in function `executeReadPreImage()`; new function `modExp256()`
- Reader4844.sol: New unverified contract with the functions `getBlobBaseFee()`, `getDataHashes()` for reading blob data (hashes) (info from its interface)

### SequencerInbox

In general most updates are EIP-4844 related, also the new role `batchPosterManager` is added and there are new checks regarding native tokens.

- Batch data flag-based decoding refined for blobs: `DATA_AUTHENTICATED_FLAG`, `BROTLI_MESSAGE_HEADER_FLAG`, `DAS_MESSAGE_HEADER_FLAG`, `DATA_BLOB_HEADER_FLAG`, `TREE_DAS_MESSAGE_HEADER_FLAG`, `ZERO_HEAVY_MESSAGE_HEADER_FLAG`
- new `batchPosterManager` functions and role: Can change the Sequencer addresses. (allows key rotation of batch posters)
- new `addSequencerL2BatchFromOrigin()` (with added `prevMessageCount, newMessageCount` in sig, old signature without them is now deprecated), `addSequencerL2BatchFromBlobs()`
- Gas refunds fetch blob price from Reader4844
- Rollup owner can update rollup address
- SequencerInbox contructor reverts if host chain is Arbitrum because blobs are not supported there
  - Checks for fee token usage and reverts if the native token is not ETH
- `forceInclusion()` now does not change the sequencer message count
- IBridge interface is introduced to use the vars TimeBounds and BatchDataLocation
- Hashing functions for blobs vs. calldata
- Time variation boundaries for batch posting vs. force inclusion -> format change

### Changed wasmModuleRoot

Upgrade L2 system to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957)

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      upgradeability.implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      implementations.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      upgradeability.implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      implementations.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

## Source code changes

```diff
.../meta.txt                                       |   0
 .../meta.txt                                       |   2 +
 .../ChallengeManager/implementation/meta.txt       |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  22 +
 .../implementation/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../src/challenge/ChallengeManager.sol             |   6 +
 .../implementation/src/libraries/Error.sol         |  27 +-
 .../implementation/src/libraries/IGasRefunder.sol  |  25 -
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../OneStepProver0/meta.txt                        |   2 +-
 .../OneStepProver0/src/bridge/IBridge.sol          |  22 +
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  25 -
 .../OneStepProverHostIo/meta.txt                   |   2 +-
 .../OneStepProverHostIo/src/bridge/IBridge.sol     |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../src/osp/OneStepProverHostIo.sol                | 107 +++-
 .../OneStepProverMath/meta.txt                     |   2 +-
 .../OneStepProverMath/src/bridge/IBridge.sol       |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../OneStepProverMemory/meta.txt                   |   2 +-
 .../OneStepProverMemory/src/bridge/IBridge.sol     |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../SequencerInbox/implementation/meta.txt         |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  22 +
 .../implementation/src/bridge/IERC20Bridge.sol     |  37 ++
 .../implementation/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../implementation/src/bridge/SequencerInbox.sol   | 578 ++++++++++++++++-----
 .../implementation/src/libraries/Error.sol         |  27 +-
 .../src/libraries/GasRefundEnabled.sol             |  52 ++
 .../implementation/src/libraries/IGasRefunder.sol  |  25 -
 .../implementation/src/libraries/IReader4844.sol   |  13 +
 .../implementation/src/precompiles/ArbGasInfo.sol  |  20 +
 39 files changed, 1358 insertions(+), 491 deletions(-)
```

Generated with discovered.json: 0x3234178d91d403e54fbe5caf0f912f14a404a51e

# Diff at Thu, 28 Mar 2024 10:37:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19125146
- current block number: 19532058

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19125146 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x01fbed9cb33e2f0bf40c3c67a6a73b1e5c4000da

# Diff at Wed, 31 Jan 2024 08:01:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 19119505
- current block number: 19125146

## Description

Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19119505 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.keySetUpdates:
+        0
    }
```

Generated with discovered.json: 0x5cf12304ad462ca8b57812f5d60a6a7fbd19058d

# Diff at Tue, 30 Jan 2024 13:05:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 19075194
- current block number: 19119505

## Description

Add the SequencerInboxVersion handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19075194 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0x616619b46862d7649368c11858319d5e420f5791

# Diff at Wed, 24 Jan 2024 08:06:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bef03f2ccf4bccd5d53aa62da5612827a762973f block: 19069632
- current block number: 19075194

## Description

Contracts have been verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19069632 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverHostIo"
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProver0"
    }
```

# Diff at Tue, 23 Jan 2024 13:21:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 19032900
- current block number: 19069632

## Description

Added discovery of rollup validators.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032900 (main branch discovery), not current.

```diff
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      name:
-        ""
+        "OneStepProverMemory"
      derivedName:
+        ""
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
      values.validators:
+        ["0x56D33424edb428744597Ec02571f14B50a33b7de"]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
      derivedName:
+        "ProxyAdmin"
    }
```

```diff
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      name:
-        ""
+        "OneStepProverMath"
      derivedName:
+        ""
    }
```

```diff
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      name:
-        ""
+        "OneStepProverHostIo"
      derivedName:
+        ""
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.batchPosters:
+        ["0x5eAD389b57d533A94a0eacd570Dc1CC59C25F2D4"]
    }
```

```diff
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      name:
-        ""
+        "OneStepProver0"
      derivedName:
+        ""
    }
```

# Diff at Thu, 18 Jan 2024 09:37:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18962479
- current block number: 19032900

## Description

Ignore nonce of GnosisSafe multisig

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18962479 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      name:
-        "GnosisSafe"
+        "OwnerMultisig"
      values.nonce:
-        9
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Mon, 08 Jan 2024 13:05:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 18962479

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    }
```

```diff
+   Status: CREATED
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
