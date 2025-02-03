Generated with discovered.json: 0x52aae644fa6a9e1f96efcc8d720f003fcc607c6f

# Diff at Mon, 03 Feb 2025 14:33:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21717097
- current block number: 21766583

## Description

[ZIP-002] 'Reduce the execution delay from 21 hours to 3 hours' executed.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      description:
-        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h."
+        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h."
      values.executionDelay:
-        75600
+        10800
      values.executionDelay_fmt:
-        "21h"
+        "3h"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21717097 (main branch discovery), not current.

```diff
    contract SophonZkEvm (0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x89022ba2dbcc5a35d299778e66998661b1a6c2f32fc7433b2e5218b42562d2e8","expirationTimestamp":1737920783,"layer2Tip":0}
    }
```

Generated with discovered.json: 0xb5d9670bb630923c5b464f1a7935d51bb4840c1f

# Diff at Tue, 28 Jan 2025 06:34:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21716177
- current block number: 21717097

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716177 (main branch discovery), not current.

```diff
    contract SophonZkEvm (0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.txFilterer.description:
-        "Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
+        "This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
      fieldMeta.getProtocolVersion.description:
-        "Protocol version, increments with each protocol change"
+        "Protocol version, increments with each protocol upgrade."
      fieldMeta.getVerifierParams.description:
-        "Verifier parameters used for proving batches"
+        "Verifier parameters used for proving batches."
      fieldMeta.daMode:
-        {"description":"0 = rollup; 1 = Validium"}
      template:
+        "shared-zk-stack/Diamond"
      description:
+        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions:
+        [{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"configure","to":"0xe4644b6d106A18062344c0A853666bc0B8f052d1","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"}]}]
    }
```

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

```diff
    contract SophonZkEvmAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      issuedPermissions:
+        [{"permission":"configure","to":"0xe14828E4405239dD331F194F1B7883eeD73bCBF3","description":"set the conversion factor for gas token deposits.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
    contract SophonChainAdminMultisig (0xe4644b6d106A18062344c0A853666bc0B8f052d1) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x94b2c7c427bbb850dac4e4bcbea018d366028aa6

# Diff at Mon, 27 Jan 2025 13:32:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21679920
- current block number: 21716177

## Description

New usdc bridge admin transfer finalized.

## Watched changes

```diff
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987) {
    +++ description: None
      values.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      values.pendingAdmin:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x5eb22ac8d74bc92d3dbf90a46549a36c36d4706c

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
