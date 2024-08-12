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
