Generated with discovered.json: 0x804eb902ff810c82f6901448578ab46a0d391f79

# Diff at Fri, 02 May 2025 17:25:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22223061
- current block number: 22223061

## Description

main contract got verified, matches standard template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22223061 (main branch discovery), not current.

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      unverified:
-        true
      sourceHashes:
+        ["0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b","0x28719e86c8042765405cbb88205d1fb130f39f3bb0923afe7fef6dd5ef798c31","0x8337740067b4f9278182a83ca83d62ca2611966b8beca6e0a49394204c8f74da","0xf3a1cb3dd9315b2dfa9e9aca6d6b09e987a1eb463588f115e2eb142eaa2a4ac6","0x396f0e8e4bc223f186f87b7eabf2f4b537ce84f8515aa16c86400c4f10af79b1"]
    }
```

Generated with discovered.json: 0xfa36421687c9545bd36f38be69ed4cdb85ca12c3

# Diff at Tue, 29 Apr 2025 08:19:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22223061
- current block number: 22223061

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22223061 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D","via":[]},{"permission":"validateZkStack","to":"0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D","via":[]},{"permission":"validateZkStack","to":"0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70","via":[]}]
    }
```

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8eb156588D2FAD21dE0066BAA5BfDcd940695196","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"}]}]
    }
```

Generated with discovered.json: 0x65cb93af048b913fb034ecf085c55132c062a3e3

# Diff at Tue, 08 Apr 2025 08:48:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22223061

## Description

Initial discovery of a standard ZK stack validium.

## Initial discovery

```diff
+   Status: CREATED
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract zkCandy Multisig (0x8eb156588D2FAD21dE0066BAA5BfDcd940695196)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```
