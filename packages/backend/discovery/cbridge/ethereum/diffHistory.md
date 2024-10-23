Generated with discovered.json: 0x640c6b582abed6a2f5653ace89be0e5d007d8890

# Diff at Mon, 21 Oct 2024 12:43:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      descriptions:
-        ["The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state."]
      description:
+        "The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state."
    }
```

Generated with discovered.json: 0x6474e88a80efc1a7467735b1d6bc35ce20856977

# Diff at Mon, 21 Oct 2024 11:05:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"]
      values.$pastUpgrades.1.1:
-        ["0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"]
+        "0xf34b28d5a18930bf121d3c62c5c9bb273d166ae4c692337a6861dc1ab2f7af08"
      values.$pastUpgrades.0.2:
+        ["0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"]
      values.$pastUpgrades.0.1:
-        ["0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"]
+        "0x125c8e37bbbbca4ccc6887fb27a1c02e05b56012a3d98ea3adac46531bf045c9"
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      values.$pastUpgrades.0.2:
+        ["0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"]
      values.$pastUpgrades.0.1:
-        ["0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"]
+        "0xdaa48a4a1a1b06b48e57b92c77cec6be8f872247c070d2bc68e859ba723f2dc9"
    }
```

Generated with discovered.json: 0xda935b498bfe310a4328d21399d910dd6873be91

# Diff at Mon, 14 Oct 2024 10:50:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract PeggedTokenBridge (0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB) {
    +++ description: None
      sourceHashes:
+        ["0x3434f13a03ea3f4494cedceb0a2fe1054473c529ae3c067ba96d7102c3225852"]
    }
```

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      sourceHashes:
+        ["0x2cffb288804b4b9aa5855910610b396abe44ded0ad8ed35981ed74d056ae8ba1","0x985f30f6f1cec4239d77034618e116e07dae859f0ded01ba80f897dadb7101f3"]
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract PeggedTokenBridgeV2 (0x52E4f244f380f8fA51816c8a10A63105dd4De084) {
    +++ description: None
      sourceHashes:
+        ["0xa8ad65c174f2e76f58ba6abc073545979d712d31810b818fa4ff50bfa9cffc09"]
    }
```

```diff
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820) {
    +++ description: None
      sourceHashes:
+        ["0x28057aec4ce9e7459369838e4a925c15a3b424afd948d070512e8a54c2870ec8"]
    }
```

```diff
    contract MessageBusOwner (0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175) {
    +++ description: None
      sourceHashes:
+        ["0x208be8f798080de1d60fcd5cba233b86c43f382ace673f95ad32b633d98be2dd"]
    }
```

```diff
    contract OriginalTokenVaultV2 (0x7510792A3B1969F9307F3845CE88e39578f2bAE1) {
    +++ description: None
      sourceHashes:
+        ["0x66b162a0fe8e04147d94a9ec40e3cf9a69114ed6e3fca427cc303eeb2d223fb9"]
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      sourceHashes:
+        ["0x1c9416031605fbda74b5da95a290e00995eaed2f6f6ba85ff2681131efe940a0"]
    }
```

```diff
    contract TransferAgent (0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b) {
    +++ description: None
      sourceHashes:
+        ["0xa8c0aeb1e8c7671f05a401b4d5b518a38e96dc6378d59e3f2b13ea55ea9f7f9f"]
    }
```

```diff
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595) {
    +++ description: None
      sourceHashes:
+        ["0xf4773d39e3c19f28a41b1b526474a51db5a28bb3fa5ea530f6af164e5263f209"]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      sourceHashes:
+        ["0x4a43bdaa7c21f911802bc9e3457cf5fef469f43b372ea6944d53823caf2f53f2","0x03c52122def17f5a3403dd9a188a1e30bee36b86dc98fb8c07a5157ccc7da286"]
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      sourceHashes:
+        ["0xd51a863b498f5cbb3e78ed94d7e69fa4cd246b862a12894d80ec1dedad934361"]
    }
```

Generated with discovered.json: 0x53a0b030ae06797da89edce8548cf08b0cb903e5

# Diff at Tue, 01 Oct 2024 10:50:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-16T07:56:23.000Z",["0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"]],["2022-11-22T04:01:35.000Z",["0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"]]]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      values.$pastUpgrades:
+        [["2023-08-07T05:02:59.000Z",["0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"]]]
    }
```

Generated with discovered.json: 0xa0391cdc9ca1b6e68870eb0b79bef240ceb6f71f

# Diff at Fri, 30 Aug 2024 07:51:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x8aff8b25a5cb707543d3efd34ba03c2851382a77

# Diff at Fri, 23 Aug 2024 09:51:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xeaa2970aabb1cefc8c82dc859a6fc9ebac12bd8e

# Diff at Wed, 21 Aug 2024 10:02:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x520d812604E7b2ce71819FDBFE9aC40E56327F8f","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4066D196A423b2b3B8B054f4F40efB47a74E200C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4066D196A423b2b3B8B054f4F40efB47a74E200C","via":[]}]
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xF140024969F6c76494a78518D9a99c8776B55f70"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF140024969F6c76494a78518D9a99c8776B55f70","via":[]}]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8E339115b295DeD49880eA62C1F06d1dbec3496b","via":[]}]
    }
```

Generated with discovered.json: 0x494b122c9ae1fdf5d29f87d59e7d30e0e4e2c2fe

# Diff at Mon, 12 Aug 2024 13:10:57 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20331848
- current block number: 20512741

## Description

cBridge bridge contracts were paused for a couple minutes, the guards were set to a 'relaxed' state before the bridge was unpaused again.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        0
+        2
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        false
+        true
    }
```

Generated with discovered.json: 0x05aa959093f9614cbf4724ee062b9db6fe434070

# Diff at Fri, 09 Aug 2024 10:09:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20331848
- current block number: 20331848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331848 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4066D196A423b2b3B8B054f4F40efB47a74E200C"]
      assignedPermissions.upgrade:
+        ["0x4066D196A423b2b3B8B054f4F40efB47a74E200C"]
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xF140024969F6c76494a78518D9a99c8776B55f70"]
      assignedPermissions.upgrade:
+        ["0xF140024969F6c76494a78518D9a99c8776B55f70"]
    }
```

Generated with discovered.json: 0x01d6f87c761817ffb94b950acac1fbcaff902d90

# Diff at Tue, 30 Jul 2024 11:11:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20331848
- current block number: 20331848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331848 (main branch discovery), not current.

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      fieldMeta:
+        {"numRelaxedGuards":{"description":"Number of relaxed guards in the Sentinel."},"relaxThreshold":{"severity":"MEDIUM","description":"Threshold of relaxed Guards needed to relax the Sentinel"},"relaxed":{"severity":"MEDIUM","description":"An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)"}}
    }
```

Generated with discovered.json: 0xfcb5ef95e521bb6ee3d77e539bb99b752c1789ac

# Diff at Thu, 18 Jul 2024 07:14:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 20310613
- current block number: 20331848

## Description

Sentinel is now unrelaxed, allowing only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.).
This is the usual state of the cbridge sentinel.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        2
+        0
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        true
+        false
    }
```

Generated with discovered.json: 0x49532ec367d0d1529fb479a74e2665248649ae36

# Diff at Mon, 15 Jul 2024 08:08:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 19724145
- current block number: 20310613

## Description

The bridge was paused for ~30min and is now unpaused again.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        0
+        2
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        false
+        true
    }
```

Generated with discovered.json: 0x122fee3f73f523b9988a98dc4b8f0c68747b3159

# Diff at Wed, 24 Apr 2024 08:48:18 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@64cf04758a7da5aaed34239f1c6d1672c16260ad block: 19704406
- current block number: 19724145

## Description

The Sentinel is unrelaxed due to Two Sentinel-Guards being in the unrelaxed state. This restricts what the Sentinel-Governors can change in the bridge contracts in the Sentinel's name.
No changes in the Bridge parameters.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        2
+        0
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        true
+        false
    }
```

Generated with discovered.json: 0xd8d108b7b19308cda326d243fc41e4d24ae821a2

# Diff at Sat, 20 Apr 2024 19:31:25 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19432769
- current block number: 19698726

## Description

Cbridge bridge contracts were paused for a few minutes and the guards are set to a 'relaxed' state before the bridges are unpaused again.

The Sentinel ProxyAdmin owner was changes from 'Celer Network: Deployer 2' to the CelerBridge Governance contract 'SimpleGovernance' called 'Bridge Governance (2)' on our website. Since the SimpleGovernance contract has a higher threshold than the deployer EOA, and additional Governance logic, this is an increase in security.

## Watched changes

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      values.owner:
-        "0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
+        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: None
      values.numRelaxedGuards:
-        0
+        2
      values.relaxed:
-        false
+        true
    }
```

Generated with discovered.json: 0x89e2c6f3a52098ecf1bd3a54070b9d191b7eeb26

# Diff at Mon, 19 Feb 2024 15:53:32 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@308930b4cc7f93870a161e88abb1361d44caae90 block: 18163828
- current block number: 19262793

## Description

One address is removed from the Liquidity Network governors and pausers, and the OriginalTokenVault governors and pausers.

## Watched changes

```diff
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820) {
      values.governors[4]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.3:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.2:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.pausers[5]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.pausers.4:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
    }
```

```diff
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595) {
      values.governors[4]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.3:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.2:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.pausers[5]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.pausers.4:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
    }
```

Generated with discovered.json: 0x9c18f02b577e0498b3dc345045e188123051fc58
