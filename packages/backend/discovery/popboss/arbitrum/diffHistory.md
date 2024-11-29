Generated with discovered.json: 0x8d0a00855c04f298063fe5fe2d9df66ae884ff9b

# Diff at Fri, 15 Nov 2024 08:18:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 269949668
- current block number: 269949668

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269949668 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","delay":0}]}
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
-        "0xd77c50bcc246B9E067A54Ead0B63300A71882c29"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.0:
+        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

Generated with discovered.json: 0x3e070e29b3fd6ee90d73c9d69b8b2f2ef740203f

# Diff at Mon, 04 Nov 2024 08:09:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 269949668
- current block number: 269949668

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269949668 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x330F8fEB25f3427cABA32446728C36ae67f2135b"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "0xd77c50bcc246B9E067A54Ead0B63300A71882c29"
      issuedPermissions.2.via.0:
-        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xd77c50bcc246B9E067A54Ead0B63300A71882c29"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.0:
+        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]}
      receivedPermissions.7.target:
-        "0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D"
+        "0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239"
      receivedPermissions.6.target:
-        "0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239"
+        "0xa4270256B160C3Ebec2d6914a906c7EC38D8d072"
      receivedPermissions.5.target:
-        "0xa4270256B160C3Ebec2d6914a906c7EC38D8d072"
+        "0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f"
      receivedPermissions.4.target:
-        "0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f"
+        "0x6e988B94C12194A925D7802FE75891364C312477"
      receivedPermissions.3.target:
-        "0x6e988B94C12194A925D7802FE75891364C312477"
+        "0x53D82686BC9827fEc03bcEe661B37b855A18EcA9"
      receivedPermissions.2.target:
-        "0x53D82686BC9827fEc03bcEe661B37b855A18EcA9"
+        "0x330F8fEB25f3427cABA32446728C36ae67f2135b"
      receivedPermissions.2.via.1:
-        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}
      receivedPermissions.2.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      receivedPermissions.1.target:
-        "0x330F8fEB25f3427cABA32446728C36ae67f2135b"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      receivedPermissions.1.via.1:
+        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}
      receivedPermissions.1.via.0.address:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x330F8fEB25f3427cABA32446728C36ae67f2135b"
      receivedPermissions.0.via.1:
-        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}
      receivedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x77d573a3ebf7798471f87d22379355cac9916d05

# Diff at Fri, 01 Nov 2024 15:05:04 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 269235372
- current block number: 269949668

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235372 (main branch discovery), not current.

```diff
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0xdb189060b1d4b5335b8519e1aca11d583114ab6a

# Diff at Wed, 30 Oct 2024 13:14:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 267471266
- current block number: 269235372

## Description

Conduit MS2: Signer added.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.7:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.0:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "2 of 7 (29%)"
+        "2 of 8 (25%)"
    }
```

Generated with discovered.json: 0x69f72827742a9be57e6c068fb10d18923615192b

# Diff at Tue, 29 Oct 2024 13:22:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267471266
- current block number: 267471266

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471266 (main branch discovery), not current.

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0xda828c89a805add28d6f121c1c7f5652bfe70caf

# Diff at Tue, 29 Oct 2024 08:53:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267471266
- current block number: 267471266

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471266 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]},{"permission":"upgrade","target":"0x330F8fEB25f3427cABA32446728C36ae67f2135b"},{"permission":"upgrade","target":"0x53D82686BC9827fEc03bcEe661B37b855A18EcA9","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]},{"permission":"upgrade","target":"0x6e988B94C12194A925D7802FE75891364C312477","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]},{"permission":"upgrade","target":"0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]},{"permission":"upgrade","target":"0xa4270256B160C3Ebec2d6914a906c7EC38D8d072","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]},{"permission":"upgrade","target":"0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]},{"permission":"upgrade","target":"0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x330F8fEB25f3427cABA32446728C36ae67f2135b"}
    }
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.2.via.0:
+        {"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","delay":0}
    }
```

```diff
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
    }
```

```diff
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0x330F8fEB25f3427cABA32446728C36ae67f2135b","via":[{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0x53D82686BC9827fEc03bcEe661B37b855A18EcA9","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0x6e988B94C12194A925D7802FE75891364C312477","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0xa4270256B160C3Ebec2d6914a906c7EC38D8d072","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]},{"permission":"upgrade","target":"0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"},{"address":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"}]
    }
```

```diff
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
    }
```

```diff
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
    }
```

```diff
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
    }
```

Generated with discovered.json: 0x00da2911a7167b4162f2a9edc78776db5b4698a0

# Diff at Mon, 28 Oct 2024 14:08:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267471266
- current block number: 267471266

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471266 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"]
    }
```

Generated with discovered.json: 0xe767c613445b1d5f6869515a9beb87286da72cdd

# Diff at Fri, 25 Oct 2024 10:03:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 264379217
- current block number: 267471266

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379217 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.0.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xa4270256B160C3Ebec2d6914a906c7EC38D8d072","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x6e988B94C12194A925D7802FE75891364C312477","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x53D82686BC9827fEc03bcEe661B37b855A18EcA9","via":[{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x330F8fEB25f3427cABA32446728C36ae67f2135b"}
      receivedPermissions.0.target:
-        "0x330F8fEB25f3427cABA32446728C36ae67f2135b"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      receivedPermissions.0.via:
+        [{"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"}]
    }
```

```diff
    contract ProxyAdmin (0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"},{"permission":"upgrade","target":"0x53D82686BC9827fEc03bcEe661B37b855A18EcA9"},{"permission":"upgrade","target":"0x6e988B94C12194A925D7802FE75891364C312477"},{"permission":"upgrade","target":"0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f"},{"permission":"upgrade","target":"0xa4270256B160C3Ebec2d6914a906c7EC38D8d072"},{"permission":"upgrade","target":"0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239"},{"permission":"upgrade","target":"0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x246bAB4F36095ABc74052Cc122c318298a9ef876"},{"permission":"upgrade","target":"0x53D82686BC9827fEc03bcEe661B37b855A18EcA9"},{"permission":"upgrade","target":"0x6e988B94C12194A925D7802FE75891364C312477"},{"permission":"upgrade","target":"0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f"},{"permission":"upgrade","target":"0xa4270256B160C3Ebec2d6914a906c7EC38D8d072"},{"permission":"upgrade","target":"0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239"},{"permission":"upgrade","target":"0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D"}]
    }
```

```diff
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.0.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.0.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.1.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
    }
```

```diff
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.0.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
    }
```

```diff
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.0.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
    }
```

```diff
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
      issuedPermissions.0.via.0:
+        {"address":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","delay":0}
    }
```

Generated with discovered.json: 0xd4f64213cbdd3f0324455dd49ad3ae86befffe8a

# Diff at Wed, 23 Oct 2024 14:36:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 264379217
- current block number: 264379217

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379217 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x246bAB4F36095ABc74052Cc122c318298a9ef876","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x246bAB4F36095ABc74052Cc122c318298a9ef876"
+        "0xd77c50bcc246B9E067A54Ead0B63300A71882c29"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

Generated with discovered.json: 0x594e468b8f517ad71710d25e8c0167070f7a828a

# Diff at Mon, 21 Oct 2024 12:51:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 264379217
- current block number: 264379217

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379217 (main branch discovery), not current.

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x04d9d10919e61dceebb61c9965947ee23ebe6e14

# Diff at Mon, 21 Oct 2024 11:13:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 264379217
- current block number: 264379217

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379217 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
      values.$pastUpgrades.0.1:
-        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
      values.$pastUpgrades.0.1:
-        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]
      values.$pastUpgrades.0.1:
-        ["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
      values.$pastUpgrades.0.1:
-        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

```diff
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
      values.$pastUpgrades.0.1:
-        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
+        "0x028f0fec788f169305337acd60998cfebebbc5cfcffacf4f12e7ddfc6a7e488d"
    }
```

Generated with discovered.json: 0x08ba9b6e26af49a8c018739daa9c92890ea5ae33

# Diff at Wed, 16 Oct 2024 11:44:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 264379217
- current block number: 264379217

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379217 (main branch discovery), not current.

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xd77c50bcc246B9E067A54Ead0B63300A71882c29","via":[]}
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1"
+        "0x75EFAE926BcB72433C70fbfA76588F16338397De"
    }
```

Generated with discovered.json: 0xe64d171c7149c58f39827a2228a2ee624cacc043

# Diff at Wed, 16 Oct 2024 10:19:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 257934417
- current block number: 264379217

## Description

Rename shared Conduit MS.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934417 (main branch discovery), not current.

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "ProofOfPlayMultisig"
+        "ConduitMultisig2"
    }
```

Generated with discovered.json: 0xf4eb220edac55a7ea8b99acd1a3ff23bbdcc0ea7

# Diff at Mon, 14 Oct 2024 10:58:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 257934417
- current block number: 257934417

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934417 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ProxyAdmin (0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract ProofOfPlayMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

```diff
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

Generated with discovered.json: 0x47e124bc34cf9460c8df077775d5d86ce1378feb

# Diff at Tue, 01 Oct 2024 11:12:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257934417
- current block number: 257934417

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934417 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
    }
```

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]]]
    }
```

```diff
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]]]
    }
```

```diff
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]]]
    }
```

```diff
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]]]
    }
```

```diff
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-17T21:43:01.000Z",["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]]]
    }
```

Generated with discovered.json: 0x969deb07360361685ec6969719f5f246acebd92e

# Diff at Fri, 27 Sep 2024 15:33:46 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 247928690
- current block number: 257934417

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247928690 (main branch discovery), not current.

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xbc8563b58d0654b2cd0251018bf51658087f9f2d

# Diff at Sun, 01 Sep 2024 08:47:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 247928690
- current block number: 247928690

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247928690 (main branch discovery), not current.

```diff
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x02f0cce496e2eea8f96242e236bb0edf7cc2d84d

# Diff at Thu, 29 Aug 2024 11:59:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 247928690

## Description

Initial discovery: Orbit stack L3 (AnyTrust 1/1 DAC) on Arbitrum by Conduit RaaS, to be used by PoP because the old 'Apex' chain is reaching its performance limits.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x246bAB4F36095ABc74052Cc122c318298a9ef876)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x330F8fEB25f3427cABA32446728C36ae67f2135b)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x490C4c92Ea9FF02EE8277222C66afD80Bfb1b7c1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x53D82686BC9827fEc03bcEe661B37b855A18EcA9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x6e988B94C12194A925D7802FE75891364C312477)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6eE94AD8057Fd7Ba4d47bb6278a261c8a9FD4E3f)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract ProofOfPlayMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xa4270256B160C3Ebec2d6914a906c7EC38D8d072)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xEe30EfcaF812d10e1EFE25E9458f76a39DAD3239)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xf3224F90c0A6138209a9EbaFd1971AD1E04eEb0D)
    +++ description: None
```
