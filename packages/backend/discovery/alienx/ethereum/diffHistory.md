Generated with discovered.json: 0xcfc7df214e60980531b8c905d428d75fb426b21a

# Diff at Fri, 01 Nov 2024 10:53:17 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21041821
- current block number: 21092323

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0x464d01a064eb5d0b56a3f2535fec015193f39308

# Diff at Tue, 29 Oct 2024 13:03:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041821
- current block number: 21041821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0xfbc923157283cedfa6cf697e0f851d4e9e5fa8c4

# Diff at Tue, 29 Oct 2024 08:00:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041821
- current block number: 21041821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39","via":[{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.2.via.0:
+        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0}
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.1.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"}
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

Generated with discovered.json: 0xe6b57eac191061745308953dfb0ddad5ef4db053

# Diff at Mon, 28 Oct 2024 14:02:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041821
- current block number: 21041821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"]
    }
```

Generated with discovered.json: 0x7c354fa429f1e25edfa1eac091199c855d159e5f

# Diff at Fri, 25 Oct 2024 09:46:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20978034
- current block number: 21041821

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"}]
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.1.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.0.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
+        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
      receivedPermissions.0.via:
+        [{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

Generated with discovered.json: 0x7ad7b73adf62efe2a689688e95627fa697620665

# Diff at Wed, 23 Oct 2024 14:35:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

Generated with discovered.json: 0x73484f151cda51a5594d004e178a69a21c972c87

# Diff at Mon, 21 Oct 2024 12:42:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0xde6c1c418e4bb201a4227a9ce0cd92542eec2c0f

# Diff at Mon, 21 Oct 2024 11:03:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
      values.$pastUpgrades.0.1:
-        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
+        "0xd7b6177a4e6d17be7a14c12889419d2036c4b7142a0d5c0af2171b3dc32d0e79"
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
      values.$pastUpgrades.0.1:
-        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
      values.$pastUpgrades.0.1:
-        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
+        "0xd7b6177a4e6d17be7a14c12889419d2036c4b7142a0d5c0af2171b3dc32d0e79"
    }
```

Generated with discovered.json: 0x4b549bcf8a5f614c62b674f27a1457df6be631f1

# Diff at Thu, 17 Oct 2024 07:37:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@af2175400fb2c7ba9b7bb17a24e2dd044854ff56 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x32AD06477129F4470294Fbaf11C0FC682d92E4A3","via":[]}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x123C1E324BC742295B4278B41C4E33831C77655C","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xff309E0c74874a3efeAAff630A818fd9c6DE4f25"
    }
```

Generated with discovered.json: 0x3ae97e6a18d9914764bc738786a89e8a01a0a902

# Diff at Wed, 16 Oct 2024 12:11:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20978034

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1)
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

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49)
    +++ description: None
```
