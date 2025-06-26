Generated with discovered.json: 0xcf60be930319c2e83ee13993ca0f1a6780b17770

# Diff at Wed, 25 Jun 2025 07:14:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22738078
- current block number: 22738078

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22738078 (main branch discovery), not current.

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0x375546bdc127d4e1f68be9040e673df8fdf0c43c

# Diff at Thu, 19 Jun 2025 11:07:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 22730620
- current block number: 22738078

## Description

ProxyAdmin verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22730620 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734) {
    +++ description: None
      name:
-        ""
+        "ProxyAdmin"
      unverified:
-        true
      receivedPermissions:
-        [{"permission":"upgrade","from":"ethereum:0x5540DE94485dB078025318428F813C5d88215823","role":"admin"}]
      values.owner:
+        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      implementationNames.0x6B0d492D08d436d3BBC7Cc873C03002686Aef734:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x04a556db1ea1a651e1174247090ad4c7105b455feab1a9672d5c4cd113b9ff0b"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"ethereum:0x5540DE94485dB078025318428F813C5d88215823","role":"admin"}]
    }
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"ethereum:0x5540DE94485dB078025318428F813C5d88215823","role":"admin","via":[{"address":"ethereum:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"ethereum:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734","role":".owner"}]
    }
```

Generated with discovered.json: 0x16a40b9ae239421428e117587de1a7f7c23fece6

# Diff at Wed, 18 Jun 2025 10:18:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22593194
- current block number: 22730620

## Description

new txfilterer added. can filter by sender, target contract and migration tx type.

## Watched changes

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      values.getL2SystemContractsUpgradeBatchNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xa9b4530ef32386347fc9c2fe1b2f3e73b31ae3b31ce973dcb88c71c377f1b4dc"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.getTransactionFilterer:
-        "0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432"
+        "0x5540DE94485dB078025318428F813C5d88215823"
    }
```

```diff
-   Status: DELETED
    contract InitiialGatewayTransactionFilterer (0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432)
    +++ description: A contract implementing the ITransactionFilterer interface, able to whitelist transactions based on sender addresses only. The whitelist is managed by the owner (0x043DA37F21c4C83b97b546724c75600c2D0C9E16).
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","role":".getAdmin"}
      receivedPermissions.0.from:
-        "ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "ethereum:0x5540DE94485dB078025318428F813C5d88215823"
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "manage filter lists."
      receivedPermissions.0.role:
-        ".getAdmin"
+        ".owner"
    }
```

```diff
+   Status: CREATED
    contract GatewayTransactionFilterer (0x5540DE94485dB078025318428F813C5d88215823)
    +++ description: A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3).
```

```diff
+   Status: CREATED
    contract  (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734)
    +++ description: None
```

## Source code changes

```diff
.../GatewayTransactionFilterer.sol                 | 652 ++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              | 729 +++++++++++++++++++++
 .../dev/null                                       | 187 ------
 3 files changed, 1381 insertions(+), 187 deletions(-)
```

Generated with discovered.json: 0xbb2ee47191ef303413b3a7a7969060ac8887516c

# Diff at Wed, 28 May 2025 11:33:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 22572509
- current block number: 22572509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22572509 (main branch discovery), not current.

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      sourceHashes.4:
-        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.3:
-        "0xb3038139dce45f6c1aaedbfb1b321c230301b2d004da109b39a17d827c6b0e4f"
      sourceHashes.2:
-        "0x1f9f7cd43747f5bcf879d544be0baca967245540e70592112cdc90c360f30486"
      sourceHashes.1:
-        "0xab7812fa82c483b781aee4c2339b860fcdee4033de1e243370a77a20fc353ddc"
+        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.0:
-        "0xca793d2e01bb37722ba48f56662e8602e693d6808ed9587867c2bac43c3dec25"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
    }
```

Generated with discovered.json: 0x2959f22728090692581419e3e7609f98d713673d

# Diff at Tue, 27 May 2025 07:40:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22572509

## Description

initial discovery of the gateway rollup: future settlement layer for zksync

## Initial discovery

```diff
+   Status: CREATED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract InitiialGatewayTransactionFilterer (0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432)
    +++ description: A contract implementing the ITransactionFilterer interface, able to whitelist transactions based on sender addresses only. The whitelist is managed by the owner (0x043DA37F21c4C83b97b546724c75600c2D0C9E16).
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3)
    +++ description: None
```
