Generated with discovered.json: 0xd590140f5b254ad2954940c540b4b895509fa9cb

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
