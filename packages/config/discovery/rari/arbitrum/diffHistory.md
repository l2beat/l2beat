Generated with discovered.json: 0xd37499659d2d511acadc45d3fc2ddeba97f46249

# Diff at Thu, 06 Mar 2025 14:24:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 303211044
- current block number: 303211044

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 303211044 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x1b13e07600db737023f4d624ddbfa8805ddb2829

# Diff at Thu, 06 Mar 2025 09:39:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 303211044
- current block number: 303211044

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 303211044 (main branch discovery), not current.

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x91591BB66075BCfF94AA128B003134165C3Ab83a"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xd581d5bf3169ebb43e26f9bb937c4fe2a68abc3d

# Diff at Tue, 04 Mar 2025 10:40:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 303211044
- current block number: 303211044

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 303211044 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      sinceBlock:
+        172197973
    }
```

```diff
    contract OneStepProver0 (0x0B851CA3b2f92Ad257283C38d95dC3Ded917300F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        285923886
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        172197973
    }
```

```diff
    contract OneStepProverMath (0x1fE9a7F654e8c7d0c63f0182ccBff91a0Ef68716) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        285923896
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        172197973
    }
```

```diff
    contract GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        172197986
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        172197973
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        172197973
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        172197973
    }
```

```diff
    contract OneStepProofEntry (0x44fBCc2210BdC537f36bc9B98aCd3b63CC8f712c) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        285923906
    }
```

```diff
    contract QuoteVerifier (0x4613038C93aF8963dc9E5e46c9fb3cbc68724df1) {
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote.
      sinceBlock:
+        277848126
    }
```

```diff
    contract ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        172197986
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      sinceBlock:
+        187813903
    }
```

```diff
    contract CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        172197986
    }
```

```diff
    contract OneStepProverMemory (0x8E83dB08E847E4b79CbD1F5E4DE56A9A6e882c6a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        285923891
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        172197973
    }
```

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        167664692
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia.
      sinceBlock:
+        172197973
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        172197973
    }
```

```diff
    contract OneStepProverHostIo (0xaAe0A2EB9C0fb6C97c095283030d0af635f44d3F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the [Blobstream DA bridge](https://arbiscan.io/address/0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof.
      sinceBlock:
+        285923901
    }
```

```diff
    contract EspressoTEEVerifier (0xEe8f0e3BC9c3965460B99D0D2DFBb05c508536fb) {
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
      sinceBlock:
+        300328531
    }
```

Generated with discovered.json: 0x585eaf19a44690de6e3d1ae1cbc0f966bb0b5031

# Diff at Thu, 27 Feb 2025 11:47:36 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 303211044
- current block number: 303211044

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 303211044 (main branch discovery), not current.

```diff
    contract GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract QuoteVerifier (0x4613038C93aF8963dc9E5e46c9fb3cbc68724df1) {
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote.
      name:
-        "V3QuoteVerifier"
+        "QuoteVerifier"
      displayName:
-        "QuoteVerifier"
    }
```

```diff
    contract ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1CustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

Generated with discovered.json: 0xa0df5547b2a032e1a17406ccfa392c468e8e7965

# Diff at Fri, 21 Feb 2025 14:12:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 303211044
- current block number: 303211044

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 303211044 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xce468ed336ecac21546980bf0fe901e0cda24029

# Diff at Thu, 06 Feb 2025 11:01:39 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2061023b431baba3e5db4c021fc2fe8a84244dd3 block: 286430025
- current block number: 303211044

## Description

Rari integrates with Espresso TEE. Batch poster was replaced with a new batch poster that runs inside a TEE. The sequencer inbox was updated so that the data posting function also includes an attestation as input, a "quote", that is verified for each batch tx by the EspressoTEEVerifier. The verifier checks this signature that can only originate from inside the TEE and reverts if unsuccessful, meaning that for every batch tx we can be sure it came from the TEE.
From Ethereum POV, there is no change in the external DA checks. The sequencer is still supposed to post to Celestia, and the inbox still checks the commitment has the designated Celesita initial byte (0x63) and length (89). No changes to proof system either.

## Watched changes

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia.
      template:
-        "orbitstack/SequencerInbox_Celestia"
+        "orbitstack/SequencerInbox_Celestia_Espresso"
      sourceHashes.1:
-        "0x7c44d7be0909b7d0aaf2c476c9c337b43f59f311d40469f3e0cc99dc46308b56"
+        "0xe5b0341ccf50d77e60d2ef63d66c4e6c36835a85d9c0f58b35fc728a7cbc1d9c"
      description:
-        "A sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia but does not reference a DA bridge."
+        "The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia."
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"},{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.to:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0xffE86271e68A0365d71B86b101Fc8CA5546E7E77"
      issuedPermissions.1.via.1:
-        {"address":"0x003e70B041abb993006C03E56c8515622a02928C"}
      issuedPermissions.1.via.0:
-        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.permission:
-        "sequence"
+        "interact"
      issuedPermissions.0.to:
-        "0x974533F82B7BADF54Fb91C15f07F3f095e35321C"
+        "0xffE86271e68A0365d71B86b101Fc8CA5546E7E77"
      issuedPermissions.0.description:
-        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
+        "Add/remove batchPosters (Sequencers)."
      values.$implementation:
-        "0xa8968d1dbA3F93FB7412d15F4139C0f63537e9E2"
+        "0x805dc3546d99AfB35EfB261b907679b67A08256e"
      values.$pastUpgrades.4:
+        ["2025-01-31T02:05:35.000Z","0x206804ee59ae4cd1cd13fc2c92c59958f3ecfcf3f210b2d583a6816e3a4a0b10",["0x805dc3546d99AfB35EfB261b907679b67A08256e"]]
      values.$pastUpgrades.3:
+        ["2025-01-29T20:23:12.000Z","0xb59494487d444c465d61f19a4fe9830806da172e2883ae0861c155f3066592a7",["0xE2DdF957261A6d8a96A7eff29C51460707FfbBE5"]]
      values.$upgradeCount:
-        3
+        5
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "0xffE86271e68A0365d71B86b101Fc8CA5546E7E77"
      values.batchPosters.0:
-        "0x974533F82B7BADF54Fb91C15f07F3f095e35321C"
+        "0xffE86271e68A0365d71B86b101Fc8CA5546E7E77"
      values.setIsBatchPosterCount:
-        1
+        5
      values.BLOBSTREAM:
+        "0xa8973BDEf20fe4112C920582938EF2F022C911f5"
      values.espressoTEEVerifier:
+        "0xEe8f0e3BC9c3965460B99D0D2DFBb05c508536fb"
    }
```

```diff
+   Status: CREATED
    contract V3QuoteVerifier (0x4613038C93aF8963dc9E5e46c9fb3cbc68724df1)
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote.
```

```diff
+   Status: CREATED
    contract EspressoTEEVerifier (0xEe8f0e3BC9c3965460B99D0D2DFBb05c508536fb)
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
```

## Source code changes

```diff
.../rari/arbitrum/.flat/EspressoTEEVerifier.sol    |  637 +++++
 .../SequencerInbox/SequencerInbox.sol              |  141 +-
 .../rari/arbitrum/.flat/V3QuoteVerifier.sol        | 2547 ++++++++++++++++++++
 3 files changed, 3319 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0xa17f3fb2888edcfb26dd6f8767766d96af24a021

# Diff at Tue, 04 Feb 2025 12:33:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 286430025
- current block number: 286430025

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 286430025 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x63729782dddf45505acdc0541899a78e0e7e5577

# Diff at Mon, 20 Jan 2025 11:10:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 286430025
- current block number: 286430025

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 286430025 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"
      directlyReceivedPermissions.9.from:
+        "0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"
      directlyReceivedPermissions.8.target:
-        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      directlyReceivedPermissions.8.from:
+        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      directlyReceivedPermissions.7.target:
-        "0x91591BB66075BCfF94AA128B003134165C3Ab83a"
      directlyReceivedPermissions.7.from:
+        "0x91591BB66075BCfF94AA128B003134165C3Ab83a"
      directlyReceivedPermissions.6.target:
-        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      directlyReceivedPermissions.6.from:
+        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      directlyReceivedPermissions.5.target:
-        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      directlyReceivedPermissions.5.from:
+        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      directlyReceivedPermissions.4.target:
-        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      directlyReceivedPermissions.4.from:
+        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      directlyReceivedPermissions.3.target:
-        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      directlyReceivedPermissions.3.from:
+        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      directlyReceivedPermissions.2.target:
-        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      directlyReceivedPermissions.2.from:
+        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      directlyReceivedPermissions.1.target:
-        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      directlyReceivedPermissions.1.from:
+        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      directlyReceivedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      directlyReceivedPermissions.0.from:
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      directlyReceivedPermissions.2.target:
-        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      directlyReceivedPermissions.2.from:
+        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      directlyReceivedPermissions.1.target:
-        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      directlyReceivedPermissions.1.from:
+        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      directlyReceivedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
      directlyReceivedPermissions.0.from:
+        "0x003e70B041abb993006C03E56c8515622a02928C"
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65"
      issuedPermissions.2.to:
+        "0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"
      receivedPermissions.11.from:
+        "0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"
      receivedPermissions.10.target:
-        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      receivedPermissions.10.from:
+        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      receivedPermissions.9.target:
-        "0x91591BB66075BCfF94AA128B003134165C3Ab83a"
      receivedPermissions.9.from:
+        "0x91591BB66075BCfF94AA128B003134165C3Ab83a"
      receivedPermissions.8.target:
-        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      receivedPermissions.8.from:
+        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      receivedPermissions.7.target:
-        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      receivedPermissions.7.from:
+        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      receivedPermissions.6.target:
-        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      receivedPermissions.6.from:
+        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      receivedPermissions.5.target:
-        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      receivedPermissions.5.from:
+        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      receivedPermissions.4.target:
-        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      receivedPermissions.4.from:
+        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      receivedPermissions.3.target:
-        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      receivedPermissions.3.from:
+        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      receivedPermissions.2.target:
-        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      receivedPermissions.2.from:
+        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      receivedPermissions.1.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions.1.from:
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions.0.target:
-        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      receivedPermissions.0.from:
+        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      directlyReceivedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      directlyReceivedPermissions.0.from:
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia but does not reference a DA bridge.
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.target:
-        "0x974533F82B7BADF54Fb91C15f07F3f095e35321C"
      issuedPermissions.0.to:
+        "0x974533F82B7BADF54Fb91C15f07F3f095e35321C"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0x1fb973a89b70acc953d65ef6a6fdca84b9079c9f

# Diff at Wed, 08 Jan 2025 10:45:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 286430025
- current block number: 286430025

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 286430025 (main branch discovery), not current.

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x4e89616060e833ee7222d66ef38b25deca2186b0

# Diff at Thu, 19 Dec 2024 15:17:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4676b49a4cd0a785c6d8fc57d5ad1d10cf53266d block: 279492285
- current block number: 286430025

## Description

Upgrade to ArbOS v32 with [the 'Celestia Nitro 3.2.1' tag](https://github.com/celestiaorg/nitro/releases/tag/v3.2.1-rc.1). This upgrade is mostly to known contracts except for the SequencerInbo and OneStepProverHostIo, of which the former includes a new Celestia header among minor changes but the latter includes references to use Blobstream on Arbitrum as the source of truth for fault proof DA.

## Watched changes

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.$implementation.1:
-        "0x5bc2d4D25446Fa7C51Eefe10e2FdF846bD355A5d"
+        "0x107B8ff1daeEFc37c27fc794fdb0828A1B5Af262"
      values.$implementation.0:
-        "0x8470c94a718f062156a4663ea797359E908b5836"
+        "0x086Fe1f212A4F311f1e3027A35dE3d45dC4AFA42"
      values.$pastUpgrades.2:
+        ["2024-12-18T16:01:31.000Z","0xf6ba2a68694536996ab068340a4b4abc811a9d72c0ad5c2af34ccea6c7a25c88",["0x086Fe1f212A4F311f1e3027A35dE3d45dC4AFA42","0x107B8ff1daeEFc37c27fc794fdb0828A1B5Af262"]]
      values.$upgradeCount:
-        2
+        3
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v32 wasmModuleRoot"
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
+        "0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x32Cb8609A12C6155333adc1594Eb5D4b78701fF7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x40c6d6C9F97FD8390025eBeF5e790CffFd450088)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x6aDA4af3EAFF458cb7851581c3784f43C16b9b8F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia but does not reference a DA bridge.
      template:
-        "orbitstack/SequencerInbox"
+        "orbitstack/SequencerInbox_Celestia"
      sourceHashes.1:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x7c44d7be0909b7d0aaf2c476c9c337b43f59f311d40469f3e0cc99dc46308b56"
      description:
-        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here. This version of the SequencerInbox also supports commitments to data that is posted to Celestia but does not reference a DA bridge."
      values.$implementation:
-        "0x305eD6932AbF2e997832C570E467320BbA1491F4"
+        "0xa8968d1dbA3F93FB7412d15F4139C0f63537e9E2"
      values.$pastUpgrades.2:
+        ["2024-12-18T16:01:31.000Z","0xf6ba2a68694536996ab068340a4b4abc811a9d72c0ad5c2af34ccea6c7a25c88",["0xa8968d1dbA3F93FB7412d15F4139C0f63537e9E2"]]
      values.$upgradeCount:
-        2
+        3
      values.sequencerVersion:
-        "0x88"
+        "0x63"
      values.CELESTIA_MESSAGE_HEADER_FLAG:
+        "0x63"
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      values.$implementation:
-        "0x7Eac96FDa155F0cE911d93D540e405e4020B082D"
+        "0xFd7A2567C6b56153f1b0D4FDbCc671d178a971fc"
      values.$pastUpgrades.3:
+        ["2024-12-18T16:01:31.000Z","0xf6ba2a68694536996ab068340a4b4abc811a9d72c0ad5c2af34ccea6c7a25c88",["0xFd7A2567C6b56153f1b0D4FDbCc671d178a971fc"]]
      values.$upgradeCount:
-        3
+        4
      values.osp:
-        "0xF01b22DB890C47774c1E275A68FEE3757Dc72AaA"
+        "0x44fBCc2210BdC537f36bc9B98aCd3b63CC8f712c"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xAB6D90EC412c4B5Db66e3DefEC32754311b1D91A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xF01b22DB890C47774c1E275A68FEE3757Dc72AaA)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x0B851CA3b2f92Ad257283C38d95dC3Ded917300F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x1fE9a7F654e8c7d0c63f0182ccBff91a0Ef68716)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x44fBCc2210BdC537f36bc9B98aCd3b63CC8f712c)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8E83dB08E847E4b79CbD1F5E4DE56A9A6e882c6a)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xaAe0A2EB9C0fb6C97c095283030d0af635f44d3F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the [Blobstream DA bridge](https://arbiscan.io/address/0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof.
```

## Source code changes

```diff
.../OneStepProverHostIo.sol                        | 1312 +++++++++++++++++++-
 .../SequencerInbox/SequencerInbox.sol              |  117 +-
 2 files changed, 1340 insertions(+), 89 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279492285 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x84f6a18d33645257c2ed73e2a18f252fcae8fda8

# Diff at Thu, 05 Dec 2024 12:02:30 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 279492285
- current block number: 279492285

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279492285 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x77aed09ff5f43f8e935a45f81fd776d0237b3dbd

# Diff at Fri, 29 Nov 2024 11:28:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 279492285
- current block number: 279492285

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279492285 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x1f293dfdf2b16ad2c14cf72276a576ea852026f3

# Diff at Fri, 29 Nov 2024 09:41:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 275817457
- current block number: 279492285

## Description

Move to discoverydriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817457 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0x7752d046a70b84610ebefb8d8246372dc99ea1cb

# Diff at Mon, 18 Nov 2024 16:54:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 271338161
- current block number: 275817457

## Description

Caldera MS member removed.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.4:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.3:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x1a029a4e7515497c38656b25c22fef2403213c62

# Diff at Fri, 15 Nov 2024 08:18:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 271338161
- current block number: 271338161

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 271338161 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0:
+        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      template:
+        "orbitstack/CustomGateway"
      displayName:
+        "CustomGateway"
      description:
+        "Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability."
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x57ee31699ef8257bc209c1692eb74f19e657cfb1

# Diff at Tue, 05 Nov 2024 15:59:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 269950572
- current block number: 271338161

## Description

Upgrade to ArbOS 32, matched by shapes.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      values.$implementation.1:
-        "0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"
+        "0x5bc2d4D25446Fa7C51Eefe10e2FdF846bD355A5d"
      values.$implementation.0:
-        "0xc326D023758d7D212d529D1E58D7f271CAe49fcf"
+        "0x8470c94a718f062156a4663ea797359E908b5836"
      values.$pastUpgrades.1:
+        ["2024-11-04T20:14:34.000Z","0x3da8ef35136e3b37f5b7ea453a773a9a22a9195d2fac287a5b30ebac420f1357",["0x8470c94a718f062156a4663ea797359E908b5836","0x5bc2d4D25446Fa7C51Eefe10e2FdF846bD355A5d"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v10.2 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1d182075d07744D71E37f77f1654165f6DAFad08"
+        "0x305eD6932AbF2e997832C570E467320BbA1491F4"
      values.$pastUpgrades.1:
+        ["2024-11-04T19:26:53.000Z","0x2def26eb81ac9d539c866215344b91b71bef86d51fb556eaf6bafd6703e68bb6",["0x305eD6932AbF2e997832C570E467320BbA1491F4"]]
      values.$upgradeCount:
-        1
+        2
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.keySetUpdates:
+        1
      values.postsBlobs:
+        false
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x935239e066F4F449D87D600e6d7c1a4F24c50f97"
+        "0x7Eac96FDa155F0cE911d93D540e405e4020B082D"
      values.$pastUpgrades.2:
+        ["2024-11-04T20:14:34.000Z","0x3da8ef35136e3b37f5b7ea453a773a9a22a9195d2fac287a5b30ebac420f1357",["0x7Eac96FDa155F0cE911d93D540e405e4020B082D"]]
      values.$pastUpgrades.1:
+        ["2024-11-04T19:26:53.000Z","0x2def26eb81ac9d539c866215344b91b71bef86d51fb556eaf6bafd6703e68bb6",["0xa24eF25c521d7927c11d7Da940b4B63e0E9575C6"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4"
+        "0xF01b22DB890C47774c1E275A68FEE3757Dc72AaA"
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x32Cb8609A12C6155333adc1594Eb5D4b78701fF7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x40c6d6C9F97FD8390025eBeF5e790CffFd450088)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x6aDA4af3EAFF458cb7851581c3784f43C16b9b8F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xAB6D90EC412c4B5Db66e3DefEC32754311b1D91A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xF01b22DB890C47774c1E275A68FEE3757Dc72AaA)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@269950572 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++----
 9 files changed, 3374 insertions(+), 1106 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269950572 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65"
      issuedPermissions.2.via.0:
-        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]}
      receivedPermissions.10.target:
-        "0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"
+        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      receivedPermissions.9.target:
-        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
+        "0x91591BB66075BCfF94AA128B003134165C3Ab83a"
      receivedPermissions.8.target:
-        "0x91591BB66075BCfF94AA128B003134165C3Ab83a"
+        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      receivedPermissions.7.target:
-        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
+        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      receivedPermissions.6.target:
-        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
+        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      receivedPermissions.5.target:
-        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
+        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      receivedPermissions.4.target:
-        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
+        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      receivedPermissions.4.via.1:
-        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}
      receivedPermissions.4.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions.3.target:
-        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
+        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      receivedPermissions.3.via.1:
+        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}
      receivedPermissions.3.via.0.address:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x003e70B041abb993006C03E56c8515622a02928C"
      receivedPermissions.2.target:
-        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
+        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      receivedPermissions.1.target:
-        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
      receivedPermissions.0.via.1:
-        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}
      receivedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x8483bbf95a3ed8086bc55eb5f4385fe61e98fd9b

# Diff at Fri, 01 Nov 2024 15:08:38 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 267471405
- current block number: 269950572

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471405 (main branch discovery), not current.

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0x799ea2de949f357bd146de637e52bdec75f9af48

# Diff at Tue, 29 Oct 2024 13:22:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267471405
- current block number: 267471405

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471405 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x476206ca2de2b2a9c02432c4ba3ca164224941eb

# Diff at Tue, 29 Oct 2024 08:53:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267471405
- current block number: 267471405

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471405 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"},{"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]},{"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"}
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0:
+        {"address":"0x139C5A235632EDdad741ff380112B3161d31a21C","delay":0}
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89","via":[{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]},{"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"},{"address":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x139C5A235632EDdad741ff380112B3161d31a21C"}]
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

Generated with discovered.json: 0x7b457920c5a448e5d77f24880d1e1d83bef20eea

# Diff at Mon, 28 Oct 2024 14:09:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267471405
- current block number: 267471405

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471405 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"]
    }
```

Generated with discovered.json: 0xa31d20a0657aedb9b13ef4c749400632a603edc3

# Diff at Fri, 25 Oct 2024 10:04:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 262310038
- current block number: 267471405

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262310038 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C"},{"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"},{"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97"},{"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564"},{"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"},{"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"},{"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324"},{"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a"},{"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3"},{"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C"},{"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"},{"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97"},{"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564"},{"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"},{"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"},{"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324"},{"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a"},{"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3"},{"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"}]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","via":[{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]}
      receivedPermissions.0.target:
-        "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      receivedPermissions.0.via:
+        [{"address":"0x003e70B041abb993006C03E56c8515622a02928C"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x003e70B041abb993006C03E56c8515622a02928C"}]
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.1.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
      issuedPermissions.0.via.0:
+        {"address":"0x003e70B041abb993006C03E56c8515622a02928C","delay":0}
    }
```

Generated with discovered.json: 0x1b2ae9f1407ebbf42be863a39963a76cdfac21db

# Diff at Wed, 23 Oct 2024 14:37:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 262310038
- current block number: 262310038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262310038 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v10.2 wasmModuleRoot"
+        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v10.2 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
-   Status: DELETED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0x61fdc61f3925777fded220b70c2d74e184c92788

# Diff at Mon, 21 Oct 2024 12:51:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 262310038
- current block number: 262310038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262310038 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0xb0d9ef37856c8281f805e65b4adb2d03f07a9ecd

# Diff at Mon, 21 Oct 2024 11:13:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 262310038
- current block number: 262310038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262310038 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]
      values.$pastUpgrades.0.1:
-        ["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x74faA20aE77FFAb036369b24066Cc5d4251900D2"]
      values.$pastUpgrades.0.1:
-        ["0x74faA20aE77FFAb036369b24066Cc5d4251900D2"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x532Ba80626DF9042353fa9509A66a25eE90fc51B"]
      values.$pastUpgrades.0.1:
-        ["0x532Ba80626DF9042353fa9509A66a25eE90fc51B"]
+        "0x55f5bdbceb2bf6779c46e60ffeaaeee6e1273aa3741b1179337a62acc0b3167a"
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]
      values.$pastUpgrades.0.1:
-        ["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x198792E7e60688FEeB0b89f0ABD3b85953Dd05Cd"]
      values.$pastUpgrades.0.1:
-        ["0x198792E7e60688FEeB0b89f0ABD3b85953Dd05Cd"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x73D3a5E535cBF98B9b5Ff7fEb8EC26e61FCEC4b7"]
      values.$pastUpgrades.0.1:
-        ["0x73D3a5E535cBF98B9b5Ff7fEb8EC26e61FCEC4b7"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xcc6DcB3FaA2436270E696994f326426B76A9f731"]
      values.$pastUpgrades.0.1:
-        ["0xcc6DcB3FaA2436270E696994f326426B76A9f731"]
+        "0x55f5bdbceb2bf6779c46e60ffeaaeee6e1273aa3741b1179337a62acc0b3167a"
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0987F33E1d59ECcedbDd6356ED34F06dd7baDcF8"]
      values.$pastUpgrades.0.1:
-        ["0x0987F33E1d59ECcedbDd6356ED34F06dd7baDcF8"]
+        "0x55f5bdbceb2bf6779c46e60ffeaaeee6e1273aa3741b1179337a62acc0b3167a"
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x84Cf78b9573daDb2FBa3028e49e0B5F785134360"]
      values.$pastUpgrades.0.1:
-        ["0x84Cf78b9573daDb2FBa3028e49e0B5F785134360"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1d182075d07744D71E37f77f1654165f6DAFad08"]
      values.$pastUpgrades.0.1:
-        ["0x1d182075d07744D71E37f77f1654165f6DAFad08"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]
      values.$pastUpgrades.0.1:
-        ["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]
+        "0xfc9b3973815b82226b0df5c0db23edf854e2ff768a745792e2c27f31b36798c2"
    }
```

Generated with discovered.json: 0x8d20e1f7457f9f6a2376a3d753fed9e31a9def73

# Diff at Wed, 16 Oct 2024 11:44:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 262310038
- current block number: 262310038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262310038 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xeCebCfC101c3a1c4dB99902cE1Df914dCAd50a65","via":[]}
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x003e70B041abb993006C03E56c8515622a02928C"
+        "0x974533F82B7BADF54Fb91C15f07F3f095e35321C"
    }
```

Generated with discovered.json: 0xc8af8fc4b37904ded3812ceb87deb22a269ef371

# Diff at Mon, 14 Oct 2024 10:59:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 262310038
- current block number: 262310038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262310038 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x9aa08a5801ef32353cbf88ebb6d778d6a9502187dea541e243cec49c41420f32"]
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x8d9e1660cd96605e8727f611f7b96ef82ad6cd8a76db94cd253b74cddd1c6bce"]
    }
```

```diff
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

Generated with discovered.json: 0xa2538d0d6d95152989aaa8f93e53b2199fc78fe1

# Diff at Thu, 10 Oct 2024 09:45:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 257934615
- current block number: 262310038

## Description

Signer changes in Caldera MS.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.4:
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.3:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$members.2:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.1:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xbf853295743511e8DC5F03809d209C33fC136d24"
      values.$members.0:
-        "0xbf853295743511e8DC5F03809d209C33fC136d24"
+        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x4718f46c9cfba9b9d4904742822dfbaf428cbd7f

# Diff at Tue, 01 Oct 2024 11:12:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257934615
- current block number: 257934615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934615 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]]]
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x74faA20aE77FFAb036369b24066Cc5d4251900D2"]]]
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:28.000Z",["0x532Ba80626DF9042353fa9509A66a25eE90fc51B"]]]
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x198792E7e60688FEeB0b89f0ABD3b85953Dd05Cd"]]]
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x73D3a5E535cBF98B9b5Ff7fEb8EC26e61FCEC4b7"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:28.000Z",["0xcc6DcB3FaA2436270E696994f326426B76A9f731"]]]
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:28.000Z",["0x0987F33E1d59ECcedbDd6356ED34F06dd7baDcF8"]]]
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x84Cf78b9573daDb2FBa3028e49e0B5F785134360"]]]
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x1d182075d07744D71E37f77f1654165f6DAFad08"]]]
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]]]
    }
```

Generated with discovered.json: 0xa0f4ede5d37c72843c2dfba45e8aefcd49525996

# Diff at Fri, 27 Sep 2024 15:34:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 256798281
- current block number: 257934615

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 256798281 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x4dd77bd22bcfe00a9ad4a44139763c4a6ad3a105

# Diff at Tue, 24 Sep 2024 08:15:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 225981507
- current block number: 256798281

## Description

Caldera MS on Arbi: 1 signer changed.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.3:
-        "0xB2a5970fB30dc34AD65c914db855766ea62f1f41"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$members.1:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.0:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xbf853295743511e8DC5F03809d209C33fC136d24"
    }
```

Generated with discovered.json: 0x1905705acf81b4890c0e7beeb7e42d6ccfcd0098

# Diff at Sun, 01 Sep 2024 08:47:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "ArbOS v10.2 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x7551e6a24298a448dc23970f2cc8540cd1b38e15

# Diff at Fri, 30 Aug 2024 08:06:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x202c82def1e609e7e87848a4275a11bf58620d43

# Diff at Fri, 23 Aug 2024 09:57:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xf51a4817e9e18c3fb0a82a5a13f1a3bc541e2212

# Diff at Wed, 21 Aug 2024 13:25:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAeDrpnsDZsKv0V5I5tcYA5z/PZaJuRA4qpki9y8x/bBV15fKHfMHv3Nyn2gBbBbtBjzXZKDCk4Q7mLMfFakukCyPyJSWB9vIczaCFaY1PjUMc//pY9x5VcTauBVhAKx5BZmQ398qhs+fqtEfZ3OgUQMYLvkim1uJ9tidMOnEo+wgWMDZAuMkXoO7BFdMzr8dBkpLjQYP9AYjPYphAERMiUoRuK8/mrXygNrokw2/RrthAH7qlt9eugYrRgIoy8hbgezFeIpVxKYTeuICu2TDV7XJk0oci4CIFSCCdD6X4gTiqbUFETjzthryj4va/GL8hc7MOkf4mPFeFHvzLTXCeh+0SSOOaH9onG0zgVvqEU5ZI6ddqiLMnGwjiJwJ52Efg=="]
    }
```

Generated with discovered.json: 0x3731b5562c1ca5fdfd4aabff761c885a360dfe23

# Diff at Wed, 21 Aug 2024 10:07:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x139C5A235632EDdad741ff380112B3161d31a21C","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[]},{"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","via":[]},{"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97","via":[]},{"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564","via":[]},{"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","via":[]},{"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","via":[]},{"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324","via":[]},{"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a","via":[]},{"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3","via":[]},{"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89","via":[]}]
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[]}]
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

Generated with discovered.json: 0xf4c7de4e63faa0e95375faaf8fabc87536305ac6

# Diff at Fri, 09 Aug 2024 12:03:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
+        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      assignedPermissions.upgrade.6:
-        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
+        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      assignedPermissions.upgrade.5:
-        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
+        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      assignedPermissions.upgrade.4:
-        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
+        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      assignedPermissions.upgrade.3:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      assignedPermissions.upgrade.2:
-        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
+        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      assignedPermissions.upgrade.1:
-        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
+        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      assignedPermissions.upgrade.0:
-        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

Generated with discovered.json: 0x4a8453a62c7fc12e782d443529e018fd6be64469

# Diff at Fri, 09 Aug 2024 10:13:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x139C5A235632EDdad741ff380112B3161d31a21C","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]
      assignedPermissions.upgrade:
+        ["0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x139C5A235632EDdad741ff380112B3161d31a21C","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]
      assignedPermissions.upgrade:
+        ["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x20f3c50552659ed011da4be3c62d336825b82a6c

# Diff at Tue, 30 Jul 2024 11:17:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x5465f341f7b7aa6a63ebf9ecba0d04be5c822285

# Diff at Tue, 11 Jun 2024 12:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216538110
- current block number: 220728802

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216538110 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xf4333c87d49f3dd17aadb8228ce984c5c5117ffd

# Diff at Thu, 30 May 2024 08:40:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 213233578
- current block number: 216538110

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBA739a061291E9aec6422BdAD3E9D48d4f7aA552"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0xf6c4a97980541fc70a3ad7b3ee2b52fa9338e04f

# Diff at Mon, 20 May 2024 15:20:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@97bea89f161f8e4e9ebb3b4ef7fb3fcb3f90924f block: 211899420
- current block number: 213233578

## Description

Discovery of Molten L3 by Caldera showed that `0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF` is likely a Caldera Multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 211899420 (main branch discovery), not current.

```diff
    contract UpgradeExecutorMemberGnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      name:
-        "UpgradeExecutorMemberGnosisSafeL2"
+        "Caldera Multisig"
    }
```

Generated with discovered.json: 0x7245a07dfe953ecc4b697834241e5f6b302ccc1e

# Diff at Thu, 25 Apr 2024 21:21:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2f1b03dc8e8dfe5c4e9bc475f6f9be6019a2af1c block: 198865244
- current block number: 204795680

## Description

A new UpgradeExecutor member was added (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF).
It's a "3 of 4" GnosisSafe.

## Watched changes

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutorMemberGnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++++++
 .../proxy/meta.txt                                 |   2 +
 19 files changed, 1323 insertions(+)
```

Generated with discovered.json: 0x58d524aecf6116a452095502141368395422d8e5

# Diff at Fri, 08 Mar 2024 11:14:21 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@f09f798ebd2ae57f4c76e08114d608edf0a51c7b block: 176692309
- current block number: 188309907

## Description

The ArbitrumDACKeysetHandler has been changed in a way to make values more readable. No values were changed inside smart contracts, only the handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 176692309 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.dacKeyset.threshold:
-        1
      values.dacKeyset.keyCount:
-        1
      values.dacKeyset.requiredSignatures:
+        1
      values.dacKeyset.membersCount:
+        1
    }
```

Generated with discovered.json: 0xa08f831bc81ba1e8dad6f27521784d8cb90e1c41

# Diff at Fri, 02 Feb 2024 11:06:01 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4d9bc19cc4a1e4baaadb947f4ad7e44e6c21ac9 block: 175360077
- current block number: 176692309

## Description

Discover the `dacKeyset`.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175360077 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
      unverified:
-        true
      derivedName:
-        ""
+        "RollupProxy"
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
      values.dacKeyset:
+        {"threshold":1,"keyCount":1}
      values.sequencerVersion:
+        "0x88"
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    }
```

Generated with discovered.json: 0x051400056af9aa68473df479ec67cf59fdd332a9

# Diff at Mon, 29 Jan 2024 10:52:51 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 175360077

## Description

Add RARI chain config.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    }
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706) {
    }
```
