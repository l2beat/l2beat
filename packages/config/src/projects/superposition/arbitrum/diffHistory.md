Generated with discovered.json: 0xed48d3b171717a345e3a1ba5eaaff3428540f8e5

# Diff at Mon, 23 Jun 2025 15:26:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@399f5abaefa11c25467c604969aa558f53a49aa0 block: 343818182
- current block number: 350405633

## Description

Conduit: add 14 permissioned sequencers / validators.

## Watched changes

```diff
    contract Superposition Multisig (0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43) {
    +++ description: None
      values.$members.0:
-        "0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B"
+        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
    }
```

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        3
      values.stakerCount:
-        1
+        2
      values.validators.15:
+        "0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
      values.validators.14:
+        "0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"
      values.validators.13:
+        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
      values.validators.12:
+        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
      values.validators.11:
+        "0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B"
      values.validators.10:
+        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
      values.validators.9:
+        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
      values.validators.8:
+        "0xD47FB043557CB2289B31d813dd4BC1223C91f872"
      values.validators.7:
+        "0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
      values.validators.6:
+        "0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
      values.validators.5:
+        "0x026919DbCFab70a2A45775088C933331A7B25Ac6"
      values.validators.4:
+        "0x83433d51B327392aA694455231D2db092eE2A5Db"
      values.validators.3:
+        "0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
      values.validators.2:
+        "0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
      values.validators.1:
-        "0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"
+        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
      values.validators.0:
-        "0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B"
+        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
    }
```

```diff
    EOA  (0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"fastconfirm","from":"arbitrum:0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"arbitrum:0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]}
      receivedPermissions.1:
-        {"permission":"validate","from":"arbitrum:0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"arbitrum:0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]}
    }
```

```diff
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.14:
+        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
      values.batchPosters.13:
+        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
      values.batchPosters.12:
+        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
      values.batchPosters.11:
+        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
      values.batchPosters.10:
+        "0x79F4b4f9103298460486EC644499Df9985E34170"
      values.batchPosters.9:
+        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
      values.batchPosters.8:
+        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
      values.batchPosters.7:
+        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
      values.batchPosters.6:
+        "0xbE119cCc44373B15517e921e9a7D54362250662D"
      values.batchPosters.5:
+        "0x583e2c664c868611a6e3F1D6dcbc8aA00DE43a7f"
      values.batchPosters.4:
+        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
      values.batchPosters.3:
+        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
      values.batchPosters.2:
+        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
      values.batchPosters.1:
+        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
      values.batchPosters.0:
-        "0x583e2c664c868611a6e3F1D6dcbc8aA00DE43a7f"
+        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
      values.setIsBatchPosterCount:
-        1
+        2
    }
```

Generated with discovered.json: 0xf614ee282edde3460ddb59663e6f96e9d73ffe81

# Diff at Wed, 18 Jun 2025 12:22:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 343818182
- current block number: 343818182

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 343818182 (main branch discovery), not current.

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xdac25ffc2b4ed83cd572cb0d4eceaee16b037338

# Diff at Wed, 04 Jun 2025 12:24:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 331092539
- current block number: 343818182

## Description

conduit multisig signer change.

## Watched changes

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.10:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.9:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.7:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x541c4e15ecd350e4f4c79f01366e07557999d3fa

# Diff at Tue, 27 May 2025 08:31:13 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 331092539
- current block number: 331092539

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331092539 (main branch discovery), not current.

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x4bcb8babf5e5dd10a369e13079a4562e38f12d8b

# Diff at Fri, 23 May 2025 09:41:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 331092539
- current block number: 331092539

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331092539 (main branch discovery), not current.

```diff
    contract Superposition Multisig (0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43) {
    +++ description: None
      directlyReceivedPermissions.1.permission:
-        "validate"
+        "fastconfirm"
      directlyReceivedPermissions.1.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      directlyReceivedPermissions.1.role:
+        ".anyTrustFastConfirmer"
      directlyReceivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      directlyReceivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      directlyReceivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x583e2c664c868611a6e3F1D6dcbc8aA00DE43a7f) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.from:
-        "0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4"
+        "0x665ADB1fF9D9C7535cf6A72d58c3Bc25F32D841d"
      receivedPermissions.3.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.3.via.1:
+        {"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x665ADB1fF9D9C7535cf6A72d58c3Bc25F32D841d"
+        "0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.from:
-        "0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55"
+        "0x31F535A566FE1Ef994858cf4D97b1207fC7388A8"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x31F535A566FE1Ef994858cf4D97b1207fC7388A8"
+        "0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4"
      receivedPermissions.0.via.1:
-        {"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}
      receivedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    contract ProxyAdmin (0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B) {
    +++ description: None
      receivedPermissions.2.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.1.role:
+        ".validators"
      receivedPermissions.1.via:
+        [{"address":"0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.via:
-        [{"address":"0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0x6f14078ee698bcc6e60077ececdbcdeb6feb691e

# Diff at Fri, 02 May 2025 17:25:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 331092539
- current block number: 331092539

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331092539 (main branch discovery), not current.

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x7516723f6d5a23b9376580169def7eea1660ca7e

# Diff at Tue, 29 Apr 2025 08:19:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 331092539
- current block number: 331092539

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331092539 (main branch discovery), not current.

```diff
    contract Inbox (0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract RollupEventInbox (0x31F535A566FE1Ef994858cf4D97b1207fC7388A8) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]},{"permission":"interact","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"}]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"}]},{"permission":"validate","to":"0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract ERC20Gateway (0x62bEd4b862254789825Cd6F2352aa2b76B16145e) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract ChallengeManager (0x665ADB1fF9D9C7535cf6A72d58c3Bc25F32D841d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract GatewayRouter (0x9FE42A08751E8566A0918807bF2870594bf22806) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract Outbox (0xa4b3B4D5f7976a8D283864ea83f1Bb3D815b1798) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x583e2c664c868611a6e3F1D6dcbc8aA00DE43a7f","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract Bridge (0xEca0fEB4aA6112a3923823559e7197294Bc49CC7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

Generated with discovered.json: 0xab1dee4a2df5dda02e026acc8d97f0abb7c07227

# Diff at Mon, 28 Apr 2025 12:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 322777194
- current block number: 331092539

## Description

Minor Arbitrum upgrade [3.1.0](https://github.com/OffchainLabs/nitro-contracts/releases/tag/v3.1.0) that everyone is doing atm.

## Watched changes

```diff
    contract Inbox (0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0x086015cafdc216efb33a7f807a00f5a4754faaa6ba74a8f21e0f4601ae8e198b"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0xD2ed924DC094abBE7ea47D872C2a8625A803c2c8"
+        "0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
      values.$pastUpgrades.1:
+        ["2025-04-25T21:55:46.000Z","0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b",["0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0xb4b1389DaC96eA8681D7e8aC479F3a9E7eD14766"
+        "0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
      values.$pastUpgrades.1:
+        ["2024-09-06T17:37:00.000Z","0xefcb1edf464c3c7aadfa482d49e0f4398846f219229bb62017e6589619a83c99",["0xb4b1389DaC96eA8681D7e8aC479F3a9E7eD14766"]]
      values.$pastUpgrades.0.2:
-        ["0xb4b1389DaC96eA8681D7e8aC479F3a9E7eD14766"]
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.1:
-        "2024-09-06T17:37:00.000Z"
+        ["0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"]
      values.$pastUpgrades.0.0:
-        "0xefcb1edf464c3c7aadfa482d49e0f4398846f219229bb62017e6589619a83c99"
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../{.flat@322777194 => .flat}/Inbox/Inbox.sol     | 19 +++++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 34 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0x462c9c0c8a892133544e4ce2f7dc48b55e1f6019

# Diff at Fri, 04 Apr 2025 08:55:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 322777194

## Description

Initial discovery of a standard AnyTrust L3 on Arbitrum (Conduit).

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0446E34D1cC4eBA5F336627BaAe82332c8607043)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract Superposition Multisig (0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x31F535A566FE1Ef994858cf4D97b1207fC7388A8)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0x62bEd4b862254789825Cd6F2352aa2b76B16145e)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x665ADB1fF9D9C7535cf6A72d58c3Bc25F32D841d)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x9FE42A08751E8566A0918807bF2870594bf22806)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xa4b3B4D5f7976a8D283864ea83f1Bb3D815b1798)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Bridge (0xEca0fEB4aA6112a3923823559e7197294Bc49CC7)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```
