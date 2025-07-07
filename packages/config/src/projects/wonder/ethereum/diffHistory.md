Generated with discovered.json: 0xfe3f01b46d88ceb2a6de88e663f77b1a4a289b19

# Diff at Fri, 04 Jul 2025 12:19:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22630381
- current block number: 22630381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22630381 (main branch discovery), not current.

```diff
    contract Wonder Multisig (0x4665ad531c35b02dE090E21FC57B69946434bf2b) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "eth:0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
      receivedPermissions.0.from:
-        "ethereum:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "eth:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "eth:0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "eth:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "eth:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
    }
```

```diff
    contract ChainAdmin (0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "eth:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
    }
```

```diff
    EOA  (0xAd0a80a085095ECa46De3053C345516f1c722D2a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      receivedPermissions.1.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    EOA  (0xB76e732643A4956a71Ac1BB0E507126651a2FC66) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      receivedPermissions.1.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

Generated with discovered.json: 0xc48a27f1a2be67b2ec24e5cab1cff65bc229f565

# Diff at Wed, 25 Jun 2025 07:17:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22630381
- current block number: 22630381

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22630381 (main branch discovery), not current.

```diff
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A) {
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
      template:
-        "shared-zk-stack/v26/ValidiumL1DAValidator"
+        "shared-zk-stack/ValidiumL1DAValidator"
    }
```

```diff
    contract zkVmDiamond (0xC8C4cB5AF7c723c7EfD360898B47920679f92C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0xcb8d5ae0d0bbf17fd78c93f9eb7c61a6f5ca3265

# Diff at Wed, 04 Jun 2025 09:30:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2c1561a0dd20d4853f867f43267ae9042bbca2cd block: 22593198
- current block number: 22630381

## Description

chainadmin change.

## Watched changes

```diff
    contract Wonder Multisig (0x4665ad531c35b02dE090E21FC57B69946434bf2b) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xC8C4cB5AF7c723c7EfD360898B47920679f92C92","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","role":".getAdmin","via":[{"address":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6","role":".owner"}]
    }
```

```diff
-   Status: DELETED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
    contract ChainAdmin (0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6) {
    +++ description: None
      values.owner:
-        "0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC"
+        "0x4665ad531c35b02dE090E21FC57B69946434bf2b"
      values.pendingOwner:
-        "0x4665ad531c35b02dE090E21FC57B69946434bf2b"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../.flat@22593198/Safe/Safe.sol => /dev/null      | 1088 --------------------
 .../Safe/SafeProxy.p.sol => /dev/null              |   37 -
 2 files changed, 1125 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593198 (main branch discovery), not current.

```diff
    contract Wonder Multisig (0x4665ad531c35b02dE090E21FC57B69946434bf2b) {
    +++ description: None
      name:
-        "Safe"
+        "Wonder Multisig"
    }
```

Generated with discovered.json: 0x145a85f519f62fd959b4249bad9f85937b126736

# Diff at Tue, 27 May 2025 15:26:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22574842

## Description

Initial discovery of a standard zk stack validium.

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
    contract Safe (0x4665ad531c35b02dE090E21FC57B69946434bf2b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract ChainAdmin (0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract zkVmDiamond (0xC8C4cB5AF7c723c7EfD360898B47920679f92C92)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```
