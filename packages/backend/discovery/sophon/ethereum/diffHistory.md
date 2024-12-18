Generated with discovered.json: 0x4bfbdaed555919395f05f231fabd4d57d97c1fdd

# Diff at Wed, 18 Dec 2024 10:10:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21421507
- current block number: 21428720

## Description

USDC escrow governance changed to a new Multisig.

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
