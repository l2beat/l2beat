Generated with discovered.json: 0x579ed26d5a9bac563594612bcca8a6f056bfbc4b

# Diff at Mon, 28 Apr 2025 12:05:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 22223308
- current block number: 22223308

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22223308 (main branch discovery), not current.

```diff
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9","via":[]},{"permission":"validateZkStack","to":"0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374","via":[]}]
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9","via":[]},{"permission":"validateZkStack","to":"0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9","via":[]},{"permission":"validateZkStack","to":"0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374","via":[]}]
    }
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5C03468829A26981c410a7930bD4853622F0B2E5","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0xca2938BdD6Bcf5860f7176fA092b0ac9510f09A3","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"}]}]
    }
```

Generated with discovered.json: 0x8a8ad097205bf9cdf04476dfa16ba8a59a1a3a7c

# Diff at Tue, 08 Apr 2025 09:32:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22223308

## Description

Initial discovery of a standard ZK stack validium.

## Initial discovery

```diff
+   Status: CREATED
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433)
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
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987)
    +++ description: None
```
