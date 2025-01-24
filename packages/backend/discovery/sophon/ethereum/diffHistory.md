Generated with discovered.json: 0x76767e39a8b67c1328d3b78f09c0e30879d1903c

# Diff at Wed, 22 Jan 2025 12:22:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21429615
- current block number: 21679920

## Description

L1USDCBridge to add a new owner.

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafe (0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD)
    +++ description: None
```

```diff
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987) {
    +++ description: None
      sourceHashes.1:
-        "0x00a6e4c29d4f4c792c4f6c43b197f95b24d626a94e6faf8ee81bc9320d579d7e"
+        "0xab9a40a5f27251ca4b4884dedef5a2b49a8928796a1fd0c6655f1623be961602"
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD","via":[]}]
      values.$admin:
-        "0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD"
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x86dF12f51E3531689e0615bb2F739ddf01337715"
+        "0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB"
      values.$pastUpgrades.1:
+        ["2025-01-21T18:29:59.000Z","0x152dc623c52d7f2b058ec5b4dfb67f5e0fee14c04dc9c0db4ae02ed2dc4ab998",["0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB"]]
      values.$upgradeCount:
-        1
+        2
      values.owner:
-        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
    }
```

## Source code changes

```diff
.../GnosisSafe/GnosisSafe.sol => /dev/null         | 953 ---------------------
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |  35 -
 .../L1USDCBridge/L1USDCBridge.sol                  |   8 +
 3 files changed, 8 insertions(+), 988 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21429615 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD) {
    +++ description: None
      name:
-        "SophonUSDCEscrowMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xdd0281d03c618ac9e56421d06a0e8e3bda3b30f7

# Diff at Mon, 20 Jan 2025 11:10:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21429615
- current block number: 21429615

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21429615 (main branch discovery), not current.

```diff
    contract SophonUSDCEscrowMultisig (0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xf553E6D903AA43420ED7e3bc2313bE9286A8F987"
      receivedPermissions.0.from:
+        "0xf553E6D903AA43420ED7e3bc2313bE9286A8F987"
    }
```

```diff
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD"
      issuedPermissions.0.to:
+        "0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD"
    }
```

Generated with discovered.json: 0x486cccdd6491b8aa9b4ffc00ed2d7936446251fa

# Diff at Wed, 18 Dec 2024 13:08:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21421507
- current block number: 21429615

## Description

USDC escrow admin changed to a new Multisig (SophonUSDCEscrowMultisig) and also gets a new owner (SophonChainAdminMultisig).

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafe (0x478a303CCe3c62CE52A8D66885b9D04F2733F3b6)
    +++ description: None
```

```diff
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x478a303CCe3c62CE52A8D66885b9D04F2733F3b6"
+        "0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD"
      values.$admin:
-        "0x478a303CCe3c62CE52A8D66885b9D04F2733F3b6"
+        "0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD"
      values.owner:
-        "0x299174d47c243B5381c6062aBEFbfF915B601D85"
+        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
      values.pendingOwner:
-        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract SophonUSDCEscrowMultisig (0x3b181838Ae9DB831C17237FAbD7c10801Dd49fcD)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe => .flat/SophonUSDCEscrowMultisig}/GnosisSafe.sol          | 0
 .../GnosisSafe => .flat/SophonUSDCEscrowMultisig}/GnosisSafeProxy.p.sol   | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21421507 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x478a303CCe3c62CE52A8D66885b9D04F2733F3b6) {
    +++ description: None
      name:
-        "SophonUSDCEscrowMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x71f166a5c91fcd46b0fec02e380196fac8467e70

# Diff at Tue, 17 Dec 2024 09:58:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21421507

## Description

Initial discovery of a ZK stack Validium sharing the standard implementations and infra contracts. (Custom gastoken SOPH not on CG yet). External USDC ecrow.

## Initial discovery

```diff
+   Status: CREATED
    contract SophonZkEvm (0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SophonUSDCEscrowMultisig (0x478a303CCe3c62CE52A8D66885b9D04F2733F3b6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SophonZkEvmAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SophonChainAdminMultisig (0xe4644b6d106A18062344c0A853666bc0B8f052d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987)
    +++ description: None
```
