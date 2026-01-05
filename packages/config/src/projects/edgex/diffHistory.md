Generated with discovered.json: 0x778311c8f9787a542779955f7375f85a4f718068

# Diff at Mon, 29 Dec 2025 10:33:47 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@515d3131558dba4f5723e3914cca96f65c2d38d1 block: 1761895426
- current timestamp: 1767004364

## Description

Upgraded Safe multisig to version 1.4.1. Also rotated one multisig member, added a new one and increased the threshold.

## Watched changes

```diff
    contract Safe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "Safe"
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
      values.$implementation:
-        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
+        "eth:0xD8A6A3ca1739423de5F634dFAa8BA224EAf16d0e"
      values.$members.1:
+        "eth:0x223c0EF36fEe905a40175d92704b1d3624218EE7"
      values.$members.2:
-        "eth:0x2BB718a3986C36c6E02D8d15cdA4370820D08169"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "3 of 4 (75%)"
      values.VERSION:
-        "1.3.0"
+        "1.4.1"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

## Source code changes

```diff
.../Safe.sol                                       |   0
 .../SafeProxy.p.sol                                |   0
 .../Proxy.p.sol                                    |   0
 .../Safe.sol}                                      | 685 ++++++++++++---------
 4 files changed, 410 insertions(+), 275 deletions(-)
```

Generated with discovered.json: 0xfd3177583f17eec5e5244067dec51b589ded3868

# Diff at Tue, 04 Nov 2025 11:32:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1761895426
- current timestamp: 1761895426

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761895426 (main branch discovery), not current.

```diff
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582) {
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
      sourceHashes.0:
-        "0xcda14981e0e7c14eca7a40d2deb572f93fbfa2b9ee6e894c5b3d967ad1068bbb"
+        "0x3f07a08957b7504b340685cdf34a4374c24c86a8d07a040efe71444cbfa2ac06"
    }
```

Generated with discovered.json: 0x0b5d761071a93bb2c167755268e28aabb1e76122

# Diff at Fri, 31 Oct 2025 07:24:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@68eb98b0468d176aa44713dcaed98f67b2a200a0 block: 1760431807
- current timestamp: 1761895426

## Description

New admin.

## Watched changes

```diff
    EOA  (eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"governStarknet","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","role":".$admin"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","description":"manage the token admin role.","role":".$admin"}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","role":".$admin"}
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
+++ description: Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts.
+++ severity: HIGH
      values.$admin:
-        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
+        "eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8"
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8)
    +++ description: None
```

## Source code changes

```diff
.../src/projects/edgex/.flat/Safe/Safe.sol         | 1088 ++++++++++++++++++++
 .../src/projects/edgex/.flat/Safe/SafeProxy.p.sol  |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xb4c46907dc4e1bd153b653fcc735028fe547dc4c

# Diff at Tue, 14 Oct 2025 11:53:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1760431807

## Description

Init discovery of EdgeX.

## Initial discovery

```diff
+   Status: CREATED
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582)
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
```

```diff
+   Status: CREATED
    contract FinalizableCommittee (eth:0x23bf3dcc14680162b7f5355aAbb56D31823c946e)
    +++ description: DAC with admin funtions to manage members. Admins are not discoverable and thus not shown here.
```

```diff
+   Status: CREATED
    reference SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562)
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PerpetualEscapeVerifier (eth:0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD)
    +++ description: Special verifier for the escape() function.
```

```diff
+   Status: CREATED
    contract EdgeXDepositor (eth:0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5)
    +++ description: A deposit wrapper that allows users to deposit arbitrary tokens to EdgeX. Tokens are swapped to USDT via 1inch and deposited to edgeX. This deposit wrapper also has fast withdrawal support using liquidity providers, but it seems deprecated in practice. Standard direct deposits and withdrawals of USDT at the StarkPerpetual contract are fully supported.
```

```diff
+   Status: CREATED
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD)
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
```
