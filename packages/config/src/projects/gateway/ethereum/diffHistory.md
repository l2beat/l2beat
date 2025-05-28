Generated with discovered.json: 0xca664d1e5701d9ee37602d9ca465f1e4e2f19e0d

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
