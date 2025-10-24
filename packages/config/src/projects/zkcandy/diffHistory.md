Generated with discovered.json: 0x3464c351e8131edaf9b74ff6111e69b39e3b8683

# Diff at Fri, 24 Oct 2025 09:13:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@11b074f59e0a769fa3d144569b93ef0f7ba1e44f block: 1756305077
- current timestamp: 1756305077

## Description

Config: add da vali comment.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756305077 (main branch discovery), not current.

```diff
    contract zkCandyZkEvmAdmin (eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: A governance proxy that lets eth:0x8eb156588D2FAD21dE0066BAA5BfDcd940695196 act through it.
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
      description:
+        "A governance proxy that lets eth:0x8eb156588D2FAD21dE0066BAA5BfDcd940695196 act through it."
    }
```

```diff
    contract zkCandy Multisig (eth:0x8eb156588D2FAD21dE0066BAA5BfDcd940695196) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract zkCandyZkEvm (eth:0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.getDAValidatorPair.description:
+        "l1da, l2da"
    }
```

Generated with discovered.json: 0x72fa1ae7ef6b107d7083a20380427a5373550f43

# Diff at Thu, 04 Sep 2025 11:14:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@66a40aec02cd7de563e226ad6f728dd9d90fa138 block: 1753944490
- current timestamp: 1756305077

## Description

Everything is templetized so i guess it's a standard upgrade. I updated the zk catalog references according the new verifier that show up here, which we already track.

## Watched changes

```diff
    contract zkCandyZkEvmAdmin (eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.3:
+        {"_protocolVersion":120259084289,"_upgradeTimestamp":1754911800}
    }
```

```diff
-   Status: DELETED
    contract DualVerifier (eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract zkCandyZkEvm (eth:0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$pastUpgrades.5:
+        ["2025-08-26T14:43:11.000Z","0xba2ebefd8f2d5a07d43c02b04e871752d75554d166382e8911ba94af72f429d9",["eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC","eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        5
+        6
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        120259084288
+        120259084289
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.getVerifier:
-        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0xD71DDC9956781bf07DbFb9fCa891f971dbE9868A"
    }
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract DualVerifier (eth:0xD71DDC9956781bf07DbFb9fCa891f971dbE9868A)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911 or eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6 depending on the supplied proof type.
```

## Source code changes

```diff
.../zkcandy/{.flat@1753944490 => .flat}/L1VerifierFflonk.sol      | 4 ++--
 .../zkcandy/{.flat@1753944490 => .flat}/L1VerifierPlonk.sol       | 8 ++++----
 2 files changed, 6 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x349b2f876456a0892148ef87fe74d9f58d210a5f

# Diff at Wed, 03 Sep 2025 15:51:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1753944490
- current timestamp: 1753944490

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753944490 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    reference ChainTypeManager (eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    reference ProtocolUpgradeHandler (eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3)
    +++ description: None
```

Generated with discovered.json: 0xcd2b0f34634c161a1cac3d37e92ac0f25c8f10bf

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa4f58548a3cfddf95b22a4f3ac0443aeb7398634

# Diff at Thu, 31 Jul 2025 06:48:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2ac2488a487f63fe85e66406479661b19d8a457e block: 1752577115
- current timestamp: 1753944490

## Description

ms singer removed.

## Watched changes

```diff
    contract zkCandy Multisig (0x8eb156588D2FAD21dE0066BAA5BfDcd940695196) {
    +++ description: None
      values.$members.4:
-        "eth:0x45Aabee36135FacD909166249f85569b13C72DD5"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x65f3f605f01e38c67c6e1c6588bb5314b1e10572

# Diff at Tue, 15 Jul 2025 10:59:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22896159
- current block number: 22924135

## Description

v28 upgrade complete.

## Watched changes

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.getL2SystemContractsUpgradeBatchNumber:
-        4077
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        4077
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0x6e60bd0408b14d086d55f00ff7313e9826e748a6fddf5cda55ae2883321c9804"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xd938eb5008cbb09125f575b117690d73e6a52192

# Diff at Mon, 14 Jul 2025 12:47:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22896159
- current block number: 22896159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22896159 (main branch discovery), not current.

```diff
    EOA  (0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D) {
    +++ description: None
      address:
-        "0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D"
+        "eth:0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D"
    }
```

```diff
    EOA  (0x2ED696E90ff598FB537100794D8463d8ea168534) {
    +++ description: None
      address:
-        "0x2ED696E90ff598FB537100794D8463d8ea168534"
+        "eth:0x2ED696E90ff598FB537100794D8463d8ea168534"
    }
```

```diff
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: None
      address:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.owner:
-        "0x8eb156588D2FAD21dE0066BAA5BfDcd940695196"
+        "eth:0x8eb156588D2FAD21dE0066BAA5BfDcd940695196"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x309EfA797ec5cd324Cb473F141F95214F3a25ab2:
-        "ChainAdmin"
      implementationNames.eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2:
+        "ChainAdmin"
    }
```

```diff
    EOA  (0x45Aabee36135FacD909166249f85569b13C72DD5) {
    +++ description: None
      address:
-        "0x45Aabee36135FacD909166249f85569b13C72DD5"
+        "eth:0x45Aabee36135FacD909166249f85569b13C72DD5"
    }
```

```diff
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579) {
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
      address:
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      description:
-        "A router contract for verifiers. Routes verification requests to 0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or 0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type."
+        "A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type."
      values.FFLONK_VERIFIER:
-        "0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
+        "eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
      values.PLONK_VERIFIER:
-        "0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
+        "eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
      implementationNames.0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579:
-        "DualVerifier"
      implementationNames.eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579:
+        "DualVerifier"
    }
```

```diff
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
      address:
-        "0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
+        "eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
      implementationNames.0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1:
-        "L1VerifierPlonk"
      implementationNames.eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1:
+        "L1VerifierPlonk"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      address:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.validatorsVTL.0:
-        "0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D"
+        "eth:0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D"
      values.validatorsVTL.1:
-        "0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70"
+        "eth:0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70"
      implementationNames.0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
-        "ValidatorTimelock"
      implementationNames.eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
+        "ValidatorTimelock"
    }
```

```diff
    EOA  (0x792b54CC6203b219ee9F3Dc9A978516E05c754f5) {
    +++ description: None
      address:
-        "0x792b54CC6203b219ee9F3Dc9A978516E05c754f5"
+        "eth:0x792b54CC6203b219ee9F3Dc9A978516E05c754f5"
    }
```

```diff
    EOA  (0x8142409931f554d99013de129cdDc70EA016d62d) {
    +++ description: None
      address:
-        "0x8142409931f554d99013de129cdDc70EA016d62d"
+        "eth:0x8142409931f554d99013de129cdDc70EA016d62d"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      address:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      values.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validatorsVTL.0:
-        "0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70"
+        "eth:0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70"
      values.validatorsVTL.1:
-        "0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D"
+        "eth:0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D"
      implementationNames.0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
-        "ValidatorTimelock"
      implementationNames.eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
+        "ValidatorTimelock"
    }
```

```diff
    contract zkCandy Multisig (0x8eb156588D2FAD21dE0066BAA5BfDcd940695196) {
    +++ description: None
      address:
-        "0x8eb156588D2FAD21dE0066BAA5BfDcd940695196"
+        "eth:0x8eb156588D2FAD21dE0066BAA5BfDcd940695196"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x2ED696E90ff598FB537100794D8463d8ea168534"
+        "eth:0x2ED696E90ff598FB537100794D8463d8ea168534"
      values.$members.1:
-        "0x792b54CC6203b219ee9F3Dc9A978516E05c754f5"
+        "eth:0x792b54CC6203b219ee9F3Dc9A978516E05c754f5"
      values.$members.2:
-        "0x8142409931f554d99013de129cdDc70EA016d62d"
+        "eth:0x8142409931f554d99013de129cdDc70EA016d62d"
      values.$members.3:
-        "0xf218a2F1E0ec05121D26483c504280a98Ffaf674"
+        "eth:0xf218a2F1E0ec05121D26483c504280a98Ffaf674"
      values.$members.4:
-        "0x45Aabee36135FacD909166249f85569b13C72DD5"
+        "eth:0x45Aabee36135FacD909166249f85569b13C72DD5"
      implementationNames.0x8eb156588D2FAD21dE0066BAA5BfDcd940695196:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x8eb156588D2FAD21dE0066BAA5BfDcd940695196:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A) {
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
      address:
-        "0x907b30407249949521Bf0c89A43558dae200146A"
+        "eth:0x907b30407249949521Bf0c89A43558dae200146A"
      implementationNames.0x907b30407249949521Bf0c89A43558dae200146A:
-        "ValidiumL1DAValidator"
      implementationNames.eth:0x907b30407249949521Bf0c89A43558dae200146A:
+        "ValidiumL1DAValidator"
    }
```

```diff
    EOA  (0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70) {
    +++ description: None
      address:
-        "0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70"
+        "eth:0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70"
    }
```

```diff
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
      address:
-        "0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
+        "eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
      implementationNames.0xD5dBE903F5382B052317D326FA1a7B63710C6a5b:
-        "L1VerifierFflonk"
      implementationNames.eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b:
+        "L1VerifierFflonk"
    }
```

```diff
    EOA  (0xf218a2F1E0ec05121D26483c504280a98Ffaf674) {
    +++ description: None
      address:
-        "0xf218a2F1E0ec05121D26483c504280a98Ffaf674"
+        "eth:0xf218a2F1E0ec05121D26483c504280a98Ffaf674"
    }
```

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      address:
-        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "eth:0xF2704433d11842d15aa76BBF0E00407267a99C92"
      values.$implementation.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.0.2.0:
-        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
+        "eth:0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.$pastUpgrades.0.2.1:
-        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
+        "eth:0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.$pastUpgrades.0.2.2:
-        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
+        "eth:0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.$pastUpgrades.0.2.3:
-        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
+        "eth:0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.$pastUpgrades.1.2.0:
-        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
+        "eth:0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.$pastUpgrades.1.2.1:
-        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
+        "eth:0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.$pastUpgrades.1.2.2:
-        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
+        "eth:0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.$pastUpgrades.1.2.3:
-        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
+        "eth:0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.$pastUpgrades.2.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.2.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.2.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.2.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.3.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.3.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.3.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.3.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.4.2.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$pastUpgrades.4.2.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$pastUpgrades.4.2.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$pastUpgrades.4.2.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facetAddresses.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
+++ severity: HIGH
      values.getAdmin:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.getBaseToken:
-        "0x0000000000000000000000000000000000000001"
+        "eth:0x0000000000000000000000000000000000000001"
      values.getBridgehub:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.getChainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.getDAValidatorPair.0:
-        "0x907b30407249949521Bf0c89A43558dae200146A"
+        "eth:0x907b30407249949521Bf0c89A43558dae200146A"
+++ severity: HIGH
      values.getDAValidatorPair.1:
-        "0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+        "eth:0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+++ severity: HIGH
      values.getPendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getSettlementLayer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.getTransactionFilterer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getVerifier:
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      values.validators.0:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.validators.1:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0xF2704433d11842d15aa76BBF0E00407267a99C92:
-        "DiamondProxy"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        "ExecutorFacet"
      implementationNames.eth:0xF2704433d11842d15aa76BBF0E00407267a99C92:
+        "DiamondProxy"
      implementationNames.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        "AdminFacet"
      implementationNames.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        "GettersFacet"
      implementationNames.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        "MailboxFacet"
      implementationNames.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        "ExecutorFacet"
    }
```

```diff
    EOA  (0xFa30EAe30351A83809657299F6Cad9557c232e8C) {
    +++ description: None
      address:
-        "0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+        "eth:0xFa30EAe30351A83809657299F6Cad9557c232e8C"
    }
```

```diff
+   Status: CREATED
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
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
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

Generated with discovered.json: 0x3d76f332d29ce7c1645ae4cbeec95406eb64f0ff

# Diff at Fri, 11 Jul 2025 13:13:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22731194
- current block number: 22896159

## Description

standard v28 op stack upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":120259084288,"_upgradeTimestamp":1752170801}
    }
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$implementation.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.4:
+        ["2025-07-11T06:25:35.000Z","0x68f8e378453c0181098912cced5fca98f2e21964ba4235fa62a364e0d442110c",["0x431449e2a28A69122860A4956A3f7191eE15aFBC","0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        4
+        5
      values.facetAddresses.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100087fe7df1cf5616646f85bd5eebc8efe5d8deac4d85bea9b9aefd88803dd"
+        "0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100050bf9baf9d08e5d3c037f8d8b486076de7e6dceb3f3fc0989ea2c99cd67"
+        "0x010005f72e443c94460f4583fb38ef5d0c5cd9897021c41df840f91465c0392e"
      values.getL2EvmEmulatorBytecodeHash:
-        "0x01000bbb8116fe7bdf690c19740ea350375426cec23f4f1f69a12fdc58adc9ba"
+        "0x01000d83e0329d9144ad041430fafcbc2b388e5434db8cb8a96e80157738a1da"
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        4077
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        4077
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x6e60bd0408b14d086d55f00ff7313e9826e748a6fddf5cda55ae2883321c9804"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        115964116992
+        120259084288
      values.getSemverProtocolVersion.1:
-        27
+        28
      values.getVerifier:
-        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        "ExecutorFacet"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        "ExecutorFacet"
    }
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to 0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or 0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

## Source code changes

```diff
.../ethereum/{.flat@22731194 => .flat}/DualVerifier.sol        |  2 +-
 .../ethereum/{.flat@22731194 => .flat}/L1VerifierFflonk.sol    |  6 +++---
 .../ethereum/{.flat@22731194 => .flat}/L1VerifierPlonk.sol     | 10 +++++-----
 .../{.flat@22731194 => .flat}/zkCandyZkEvm/AdminFacet.1.sol    |  2 +-
 .../{.flat@22731194 => .flat}/zkCandyZkEvm/ExecutorFacet.4.sol |  2 +-
 .../{.flat@22731194 => .flat}/zkCandyZkEvm/GettersFacet.2.sol  |  2 +-
 .../{.flat@22731194 => .flat}/zkCandyZkEvm/MailboxFacet.3.sol  |  2 +-
 7 files changed, 13 insertions(+), 13 deletions(-)
```

Generated with discovered.json: 0xd9a33a0a08fe09354deb2bd012af5e5d5c227252

# Diff at Fri, 04 Jul 2025 12:19:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22731194
- current block number: 22731194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731194 (main branch discovery), not current.

```diff
    EOA  (0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D) {
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
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "eth:0xF2704433d11842d15aa76BBF0E00407267a99C92"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "eth:0xF2704433d11842d15aa76BBF0E00407267a99C92"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "eth:0xF2704433d11842d15aa76BBF0E00407267a99C92"
    }
```

```diff
    contract zkCandy Multisig (0x8eb156588D2FAD21dE0066BAA5BfDcd940695196) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      receivedPermissions.0.from:
-        "ethereum:0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "eth:0xF2704433d11842d15aa76BBF0E00407267a99C92"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
    }
```

```diff
    EOA  (0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      receivedPermissions.1.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

Generated with discovered.json: 0xf7e49816478e5740aad8ca8bfc4244cf7baa2d1c

# Diff at Wed, 25 Jun 2025 07:17:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22731194
- current block number: 22731194

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731194 (main branch discovery), not current.

```diff
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A) {
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
      template:
-        "shared-zk-stack/v26/ValidiumL1DAValidator"
+        "shared-zk-stack/ValidiumL1DAValidator"
    }
```

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0x5bcc12c46dd8564f1146e2ae1789c936a36a9d31

# Diff at Wed, 18 Jun 2025 12:24:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22593199
- current block number: 22731194

## Description

config: wasmmoduleroot map updated.

## Watched changes

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.getL2SystemContractsUpgradeBatchNumber:
-        3987
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        3987
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0x7ead5e3e088ce4a6d739a729550f453bdc83ca10104b1916d9b0ee8722946d4a"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x2b3312e45d642e34f7d2395a66f5f4494f2239d2

# Diff at Fri, 30 May 2025 04:34:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22223061
- current block number: 22593199

## Description

v27 upgrade to standard contracts.

## Watched changes

```diff
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":115964116992,"_upgradeTimestamp":1748443499}
    }
```

```diff
-   Status: DELETED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.0:
-        "0xbceaa498ea422a98ec91f01d7b76774610e543c9efd855141de933065f32b308"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
      values.$implementation.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$implementation.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$implementation.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$implementation.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.3:
+        ["2025-03-26T14:00:47.000Z","0x2b263b46f39c303439cc9863a7c0a4597a5b488c4d31ec46642e4567e190dc57",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
      values.$pastUpgrades.2.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.2.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.2.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.2.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.2.1:
-        "2025-03-26T14:00:47.000Z"
+        "0x96ca5b3c6c6131b5d6a538059dea8d2687a9e1ce8c9bed9aa8f97f80fa9e4617"
      values.$pastUpgrades.2.0:
-        "0x2b263b46f39c303439cc9863a7c0a4597a5b488c4d31ec46642e4567e190dc57"
+        "2025-05-29T21:22:35.000Z"
      values.$upgradeCount:
-        3
+        4
      values.facetAddresses.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.facetAddresses.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.facetAddresses.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.facetAddresses.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.facets.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81"
+        "0x0100087fe7df1cf5616646f85bd5eebc8efe5d8deac4d85bea9b9aefd88803dd"
      values.getL2DefaultAccountBytecodeHash:
-        "0x010004dbf8be36c421254d005352f8245146906919be0099e8a50d0e78df85e0"
+        "0x0100050bf9baf9d08e5d3c037f8d8b486076de7e6dceb3f3fc0989ea2c99cd67"
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        3987
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        3987
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x7ead5e3e088ce4a6d739a729550f453bdc83ca10104b1916d9b0ee8722946d4a"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        111669149696
+        115964116992
      values.getSemverProtocolVersion.0:
-        26
+        27
      values.getVerifier:
-        "0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
+        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
      values.getL2EvmEmulatorBytecodeHash:
+        "0x01000bbb8116fe7bdf690c19740ea350375426cec23f4f1f69a12fdc58adc9ba"
      implementationNames.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        "AdminFacet"
      implementationNames.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        "GettersFacet"
      implementationNames.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        "MailboxFacet"
      implementationNames.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        "ExecutorFacet"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        "ExecutorFacet"
    }
```

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
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

## Source code changes

```diff
.../zkcandy/ethereum/.flat/DualVerifier.sol        |   97 ++
 .../zkcandy/ethereum/.flat/L1VerifierFflonk.sol    | 1605 ++++++++++++++++++++
 .../Verifier.sol => .flat/L1VerifierPlonk.sol}     |   12 +-
 .../zkCandyZkEvm/AdminFacet.1.sol                  |   37 +-
 .../zkCandyZkEvm/ExecutorFacet.4.sol               |   82 +-
 .../zkCandyZkEvm/GettersFacet.2.sol                |   27 +-
 .../zkCandyZkEvm/MailboxFacet.3.sol                |   74 +-
 7 files changed, 1885 insertions(+), 49 deletions(-)
```

Generated with discovered.json: 0x58d16b6e95db11cbf9063263b9a05825fe68039c

# Diff at Tue, 27 May 2025 08:30:48 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22223061
- current block number: 22223061

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22223061 (main branch discovery), not current.

```diff
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.3:
-        "0xf3a1cb3dd9315b2dfa9e9aca6d6b09e987a1eb463588f115e2eb142eaa2a4ac6"
      sourceHashes.2:
-        "0x28719e86c8042765405cbb88205d1fb130f39f3bb0923afe7fef6dd5ef798c31"
      sourceHashes.1:
-        "0x396f0e8e4bc223f186f87b7eabf2f4b537ce84f8515aa16c86400c4f10af79b1"
+        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.0:
-        "0x8337740067b4f9278182a83ca83d62ca2611966b8beca6e0a49394204c8f74da"
+        "0xbceaa498ea422a98ec91f01d7b76774610e543c9efd855141de933065f32b308"
    }
```

Generated with discovered.json: 0x38c8de15956a4b726f4e90a023dfab64c5ce663b

# Diff at Fri, 23 May 2025 09:41:10 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22223061
- current block number: 22223061

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22223061 (main branch discovery), not current.

```diff
    EOA  (0x2B711ee00B50d67667c4439c28AeAf7B75CB6E0D) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

```diff
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".getAdmin"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract zkCandy Multisig (0x8eb156588D2FAD21dE0066BAA5BfDcd940695196) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getAdmin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xc300Cc8f451C9EF8DaDE822bd0f9636117209F70) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

Generated with discovered.json: 0x804eb902ff810c82f6901448578ab46a0d391f79

# Diff at Fri, 02 May 2025 17:25:13 GMT:

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

Generated with discovered.json: 0xb898a15568c9017826f4c5c80bbf72aec95a8fb4

# Diff at Fri, 31 Jan 2025 11:51:06 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 54952349

## Description

Empty, see comment in config.jsonc

