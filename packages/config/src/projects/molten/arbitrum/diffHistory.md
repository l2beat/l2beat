Generated with discovered.json: 0x5b9ce49a68a45c202f50feaad5455c88b6cb33ab

# Diff at Thu, 06 Mar 2025 14:23:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 287771961
- current block number: 287771961

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x088c75e813eece79ca5543146a77daf386652800

# Diff at Thu, 06 Mar 2025 09:39:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 287771961
- current block number: 287771961

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x235000876bd58336C802B3546Fc0250f285fCc79","0x9676D55Ccd46ce72235b16bA645008D1D3350B14"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x518f784570e45bae0e5a6e60a0f0e12e791251aa

# Diff at Tue, 04 Mar 2025 10:40:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 287771961
- current block number: 287771961

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract OneStepProver0 (0x0a64A865D06bcbB7840037bE481144101d266580) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        273925784
    }
```

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        196643801
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        196643801
    }
```

```diff
    contract OneStepProverMemory (0x123AC1bECf24be86Fe2426F32b8e65e39eE73071) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        273925792
    }
```

```diff
    contract OneStepProverHostIo (0x16a287aAeA20b936103dd3C1Af970556A1a2B3F0) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        273925810
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        196643801
    }
```

```diff
    contract ERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        196643863
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
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        196643801
    }
```

```diff
    contract OneStepProofEntry (0x82f0eB3D277d4f67c3624b76ebD857e9dccE2b29) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        273925818
    }
```

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      sinceBlock:
+        196643801
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        196643801
    }
```

```diff
    contract RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        196643801
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
    contract GatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        196643863
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        196643801
    }
```

```diff
    contract OneStepProverMath (0xC180876F40Bd889f1AC598B0DBD9c3eA87040a03) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        273925800
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        196643801
    }
```

Generated with discovered.json: 0x23e12d481dde344c7773b6858df4a8183e857048

# Diff at Thu, 27 Feb 2025 11:47:31 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 287771961
- current block number: 287771961

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract ERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0x8e4df851f7b6aee965e3becf90a30e5a0fc6ae48

# Diff at Fri, 21 Feb 2025 14:12:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287771961
- current block number: 287771961

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract ERC20Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xef9a3b26971b510f409784c9563ad9deb89338d2

# Diff at Tue, 04 Feb 2025 12:33:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287771961
- current block number: 287771961

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
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

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xf18c9b5536620b6ccab48d05cb598e487202b3e3

# Diff at Mon, 20 Jan 2025 11:10:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287771961
- current block number: 287771961

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
      issuedPermissions.2.to:
+        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
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
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.target:
-        "0x451f05C41BC5CC10d7D63ed88bA0A522FE183074"
      issuedPermissions.0.to:
+        "0x451f05C41BC5CC10d7D63ed88bA0A522FE183074"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
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
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
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
      receivedPermissions.10.target:
-        "0xE1d32C985825562edAa906fAC39295370Db72195"
      receivedPermissions.10.from:
+        "0xE1d32C985825562edAa906fAC39295370Db72195"
      receivedPermissions.9.target:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      receivedPermissions.9.from:
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      receivedPermissions.8.target:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      receivedPermissions.8.from:
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      receivedPermissions.7.target:
-        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      receivedPermissions.7.from:
+        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      receivedPermissions.6.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.6.from:
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.5.target:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      receivedPermissions.5.from:
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      receivedPermissions.4.target:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      receivedPermissions.4.from:
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      receivedPermissions.3.target:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      receivedPermissions.3.from:
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      receivedPermissions.2.target:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
      receivedPermissions.2.from:
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
      receivedPermissions.1.target:
-        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      receivedPermissions.1.from:
+        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      receivedPermissions.0.target:
-        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      receivedPermissions.0.from:
+        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      directlyReceivedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      directlyReceivedPermissions.0.from:
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
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

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xE1d32C985825562edAa906fAC39295370Db72195"
      directlyReceivedPermissions.8.from:
+        "0xE1d32C985825562edAa906fAC39295370Db72195"
      directlyReceivedPermissions.7.target:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      directlyReceivedPermissions.7.from:
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      directlyReceivedPermissions.6.target:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      directlyReceivedPermissions.6.from:
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      directlyReceivedPermissions.5.target:
-        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      directlyReceivedPermissions.5.from:
+        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      directlyReceivedPermissions.4.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      directlyReceivedPermissions.4.from:
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      directlyReceivedPermissions.3.target:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      directlyReceivedPermissions.3.from:
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      directlyReceivedPermissions.2.target:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      directlyReceivedPermissions.2.from:
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      directlyReceivedPermissions.1.target:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      directlyReceivedPermissions.1.from:
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      directlyReceivedPermissions.0.target:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
      directlyReceivedPermissions.0.from:
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
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
-        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      directlyReceivedPermissions.2.from:
+        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      directlyReceivedPermissions.1.target:
-        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      directlyReceivedPermissions.1.from:
+        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      directlyReceivedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
      directlyReceivedPermissions.0.from:
+        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
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
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
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
    contract ERC20Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
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
    contract ERC20Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
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

Generated with discovered.json: 0x4b843ff4b55fb49168c1b43a2a61b8b9d8c3a35e

# Diff at Wed, 08 Jan 2025 10:44:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287771961
- current block number: 287771961

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771961 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xfcf410beb9a14a5b38aa4cc5f1fca96de68b1354

# Diff at Mon, 23 Dec 2024 12:49:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 275817646
- current block number: 287771961

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9f3d7b92358f10b13e2cc0bda4471baec1feee90

# Diff at Thu, 05 Dec 2024 11:59:42 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 275817646
- current block number: 275817646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817646 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xb25340ce56ed689a60c4ecb765788cc48c80a8e2

# Diff at Fri, 29 Nov 2024 11:28:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 275817646
- current block number: 275817646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
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

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x642bdac5a5a12abf39b0acf030201a7865a810fb

# Diff at Fri, 29 Nov 2024 09:31:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 275817646
- current block number: 275817646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2:
+        {"permission":"validate","target":"0x152FFeF04881BD1390D2A52009f42d56EaC7AA03","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]}
      receivedPermissions.9.target:
-        "0xE1d32C985825562edAa906fAC39295370Db72195"
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      receivedPermissions.8.target:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      receivedPermissions.7.target:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
+        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      receivedPermissions.6.target:
-        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.5.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      receivedPermissions.4.target:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      receivedPermissions.3.target:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      receivedPermissions.2.target:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
      receivedPermissions.1.target:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
+        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      receivedPermissions.1.via.1:
-        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}
      receivedPermissions.1.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xcac9e38c0dff2a66afe80cdfbc7d05a6c708d4ad

# Diff at Thu, 28 Nov 2024 11:03:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 275817646
- current block number: 275817646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2:
-        {"permission":"validate","target":"0x152FFeF04881BD1390D2A52009f42d56EaC7AA03","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
      issuedPermissions.1.via.0:
-        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}
      issuedPermissions.0.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0:
+        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}
    }
```

Generated with discovered.json: 0xeb0313172f93da33ef7c13adfb7eb00e14a6b048

# Diff at Mon, 18 Nov 2024 16:55:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 274302291
- current block number: 275817646

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

Generated with discovered.json: 0xf6df6010d9a74dbf9065fee074f733fb4e79e8b5

# Diff at Fri, 15 Nov 2024 08:18:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 274302291
- current block number: 274302291

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274302291 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x0000000000000000000000000000000000000000"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

Generated with discovered.json: 0x54808d7d8f61eff331d637f91846e1d5504b1333

# Diff at Thu, 14 Nov 2024 07:08:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 267470911
- current block number: 274302291

## Description

Standard ArbOS 32 upgrade (fastconfirmer not set) and discodriven data.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.1.via.0:
-        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      values.$implementation.1:
-        "0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"
+        "0x8522769aEF1A87bE45530E0C84834BCce38CA9Bd"
      values.$implementation.0:
-        "0xc326D023758d7D212d529D1E58D7f271CAe49fcf"
+        "0x4f82B5de97Ad3690ee319878083503178Fd8E0B9"
      values.$pastUpgrades.1:
+        ["2024-11-13T06:54:44.000Z","0x9a8ae683e857b80a843f7f071b0f831ac8162c6ac2c09fd9a8a514809d80c7af",["0x4f82B5de97Ad3690ee319878083503178Fd8E0B9","0x8522769aEF1A87bE45530E0C84834BCce38CA9Bd"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v11.1 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1d182075d07744D71E37f77f1654165f6DAFad08"
+        "0x79177caeDf321963EFed06E562017181B2e8aDC7"
      values.$pastUpgrades.1:
+        ["2024-11-13T04:34:48.000Z","0xa3cef71c7eacc17dedd4ff7a2c732cd42e982d2ca5c620fe8364225fce9760ab",["0x79177caeDf321963EFed06E562017181B2e8aDC7"]]
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
+        true
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]}
      receivedPermissions.9.target:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
+        "0xE1d32C985825562edAa906fAC39295370Db72195"
      receivedPermissions.8.target:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      receivedPermissions.7.target:
-        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      receivedPermissions.6.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      receivedPermissions.5.target:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.4.target:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      receivedPermissions.3.target:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      receivedPermissions.2.target:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      receivedPermissions.1.target:
-        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
      receivedPermissions.1.via.1:
+        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}
      receivedPermissions.1.via.0.address:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
      receivedPermissions.0.permission:
-        "configure"
+        "upgrade"
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x935239e066F4F449D87D600e6d7c1a4F24c50f97"
+        "0x84c179B5651A762a81A490BA03D27997A5922EC1"
      values.$pastUpgrades.2:
+        ["2024-11-13T06:54:44.000Z","0x9a8ae683e857b80a843f7f071b0f831ac8162c6ac2c09fd9a8a514809d80c7af",["0x84c179B5651A762a81A490BA03D27997A5922EC1"]]
      values.$pastUpgrades.1:
+        ["2024-11-13T04:34:48.000Z","0xa3cef71c7eacc17dedd4ff7a2c732cd42e982d2ca5c620fe8364225fce9760ab",["0x3bD530a9a48F17052D5d3c30e7582Fcb42BdFD23"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4"
+        "0x82f0eB3D277d4f67c3624b76ebD857e9dccE2b29"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "upgrade"
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
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
    contract OneStepProver0 (0x0a64A865D06bcbB7840037bE481144101d266580)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x123AC1bECf24be86Fe2426F32b8e65e39eE73071)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x16a287aAeA20b936103dd3C1Af970556A1a2B3F0)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x82f0eB3D277d4f67c3624b76ebD857e9dccE2b29)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xC180876F40Bd889f1AC598B0DBD9c3eA87040a03)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@267470911 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
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
discovery. Values are for block 267470911 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.postsBlobs:
+        false
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract ERC20Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
-   Status: DELETED
    contract Molten Token (0x66E535e8D2ebf13F49F3D49e5c50395a97C137b1)
    +++ description: None
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
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
    contract ERC20Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract ERC20Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      template:
+        "orbitstack/Bridge"
      displayName:
+        "Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x73b183bd2f3fe6db0fa76ef2cdc22c03494e3e7c

# Diff at Mon, 04 Nov 2024 08:08:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 267470911
- current block number: 267470911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267470911 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
      issuedPermissions.2.via.0:
-        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]}
      receivedPermissions.9.target:
-        "0xE1d32C985825562edAa906fAC39295370Db72195"
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      receivedPermissions.8.target:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      receivedPermissions.7.target:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
+        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
      receivedPermissions.6.target:
-        "0x9676D55Ccd46ce72235b16bA645008D1D3350B14"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.5.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      receivedPermissions.4.target:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      receivedPermissions.3.target:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      receivedPermissions.2.target:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
      receivedPermissions.1.target:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
+        "0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"
      receivedPermissions.1.via.1:
-        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}
      receivedPermissions.1.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xb71d354986eaa9a13b4f4bfc08b7f9e52bb0dd00

# Diff at Tue, 29 Oct 2024 13:22:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267470911
- current block number: 267470911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267470911 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
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
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0x1da286e6008e08887c1fa98012484eeafd7f551d

# Diff at Tue, 29 Oct 2024 08:11:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267470911
- current block number: 267470911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267470911 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0:
+        {"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","delay":0}
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0","via":[{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]},{"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"},{"address":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"}]
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"},{"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]},{"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"}
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
    }
```

Generated with discovered.json: 0xa9d2ddb31b45a10d757b351e9ed989d10724d272

# Diff at Mon, 28 Oct 2024 14:08:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267470911
- current block number: 267470911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267470911 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"]
    }
```

Generated with discovered.json: 0x8a61b8c7dbc9d253f2ddc185be233d5a578f6236

# Diff at Fri, 25 Oct 2024 10:02:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 262309561
- current block number: 267470911

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262309561 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.1.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"},{"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79"},{"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"},{"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"},{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"},{"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14"},{"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"},{"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"},{"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"},{"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79"},{"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"},{"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"},{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d"},{"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14"},{"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"},{"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"},{"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195"}]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","via":[{"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      issuedPermissions.0.via.0:
+        {"address":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","delay":0}
    }
```

Generated with discovered.json: 0x9c10e6997143a6a323bc017e798decf63e48e8da

# Diff at Wed, 23 Oct 2024 14:36:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 262309561
- current block number: 262309561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262309561 (main branch discovery), not current.

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
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0x152FFeF04881BD1390D2A52009f42d56EaC7AA03"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v11.1 wasmModuleRoot"
+        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v11.1 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
-   Status: DELETED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
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

Generated with discovered.json: 0x152dacefa0470df3dadc4f0ae734f427352885ea

# Diff at Mon, 21 Oct 2024 12:51:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 262309561
- current block number: 262309561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262309561 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x623569fe9cf9c6f94be98c28b65427859f5334f5

# Diff at Mon, 21 Oct 2024 11:13:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 262309561
- current block number: 262309561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262309561 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]
      values.$pastUpgrades.0.1:
-        ["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1d182075d07744D71E37f77f1654165f6DAFad08"]
      values.$pastUpgrades.0.1:
-        ["0x1d182075d07744D71E37f77f1654165f6DAFad08"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]
      values.$pastUpgrades.0.1:
-        ["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]
      values.$pastUpgrades.0.1:
-        ["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]
+        "0x23ef7ccf294b19a7ece9a717b1f66c067825a5c354b3ada4c8e323742e562d64"
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]
      values.$pastUpgrades.0.1:
-        ["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]
      values.$pastUpgrades.0.1:
-        ["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]
      values.$pastUpgrades.0.1:
-        ["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]
      values.$pastUpgrades.0.1:
-        ["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]
+        "0x23ef7ccf294b19a7ece9a717b1f66c067825a5c354b3ada4c8e323742e562d64"
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]
      values.$pastUpgrades.0.1:
-        ["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xC5Db571093C4600559e239497d147476F7543b15"]
      values.$pastUpgrades.0.1:
-        ["0xC5Db571093C4600559e239497d147476F7543b15"]
+        "0x95b91b77f8acfeba7f9d6fdb02826847e1a437c49ba88d2c32cd42ec716850da"
    }
```

Generated with discovered.json: 0x6a3c02ed3121ef9a9ed98883e1073024e45baf77

# Diff at Wed, 16 Oct 2024 11:44:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 262309561
- current block number: 262309561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262309561 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x152FFeF04881BD1390D2A52009f42d56EaC7AA03","via":[]}
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238"
+        "0x451f05C41BC5CC10d7D63ed88bA0A522FE183074"
    }
```

Generated with discovered.json: 0xba969e1f36b843f34efc37e3c3e4ead11c133fc1

# Diff at Mon, 14 Oct 2024 10:58:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 262309561
- current block number: 262309561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262309561 (main branch discovery), not current.

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
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

```diff
    contract Molten Token (0x66E535e8D2ebf13F49F3D49e5c50395a97C137b1) {
    +++ description: None
      sourceHashes:
+        ["0xc1f88764c5e818b85d1da1dda9dd8a8bdd84b5c6113b6b86568936a382f98206"]
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
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
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
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
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
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
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
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xc138999c828d091534e4fea5f3730160aa2a6366cea16b82a55b9c8de07670df"]
    }
```

```diff
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

Generated with discovered.json: 0x703063db158c49e4060498530101ba6f2f7ca6db

# Diff at Thu, 10 Oct 2024 09:43:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 257933728
- current block number: 262309561

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

Generated with discovered.json: 0x896562db29c17ca0f822bd2070e7268a404e8a74

# Diff at Tue, 01 Oct 2024 11:12:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257933728
- current block number: 257933728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257933728 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x1d182075d07744D71E37f77f1654165f6DAFad08"]]]
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]]]
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:38.000Z",["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]]]
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]]]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:38.000Z",["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]]]
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]]]
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xC5Db571093C4600559e239497d147476F7543b15"]]]
    }
```

Generated with discovered.json: 0xd74f98a205e5c853c34d969598ca00f8cd51b914

# Diff at Fri, 27 Sep 2024 15:30:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 256797668
- current block number: 257933728

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 256797668 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xba6a9ba9b733cfed127cd2188fd6eea93c30037a

# Diff at Tue, 24 Sep 2024 08:12:58 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 225981159
- current block number: 256797668

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

Generated with discovered.json: 0x396dbde7598716830ae0950812ba7f7f7fe96109

# Diff at Sun, 01 Sep 2024 08:47:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "ArbOS v11.1 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x65389223029fbada5686bfc2dce5f92ea305bbef

# Diff at Fri, 30 Aug 2024 08:06:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
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
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe9be18e14677ae9bcdff86d79534c490f09bb6bf

# Diff at Fri, 23 Aug 2024 09:57:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xb39bef3c35391edda9446e65d14c1a5acebc4ab3

# Diff at Wed, 21 Aug 2024 13:25:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAqQTw4ByRTsc9900Jqz1uF86NCR0qf4Qorr6m+4UMuebljjJmkm9ao1wgU9YMVsiAQiJZW5V0wv3eSEoHEOfpL4KesBDWtj3Dxlie526tY8MGcEruvE+/+yWenFV64DjgSIEgMvQWcMEnYuBeuIcPq3iFWoPlZ5xjrFq3TC3pg/4vNdHyraTaGAoSE1kpr95QJjp3pjuOh8EpCD1i4skjJP4YVjtsui7a8t3s8TTwTo3QYk/HTPLAJ8e15iBTin/xcbxa8wfNTBespH4pXgIQBYT/M2kyNWURyaJGz/Uk0ecJPEVtTwNPedztrARTHgkAiCDWd63/ekdUN0plGc8G4aWWg/MJN1X3UZwSUf5Z6PIG/9qtBgtijcxx2UvCjvyw=="]
    }
```

Generated with discovered.json: 0x0fbfa465bbc1eba2c39fe107cabcbe8b0672d5d5

# Diff at Wed, 21 Aug 2024 10:07:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","0x235000876bd58336C802B3546Fc0250f285fCc79","0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","0x92ff91308F5f1036435f23c2F4F136Bb7475425d","0x9676D55Ccd46ce72235b16bA645008D1D3350B14","0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","0xE1d32C985825562edAa906fAC39295370Db72195","0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","via":[]},{"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79","via":[]},{"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","via":[]},{"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","via":[]},{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[]},{"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14","via":[]},{"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","via":[]},{"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","via":[]},{"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

Generated with discovered.json: 0x0c198c0def2d92502a576841ad8a5c77b78a0363

# Diff at Fri, 09 Aug 2024 12:03:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      assignedPermissions.upgrade.7:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0xE1d32C985825562edAa906fAC39295370Db72195"
      assignedPermissions.upgrade.6:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      assignedPermissions.upgrade.4:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      assignedPermissions.upgrade.3:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      assignedPermissions.upgrade.2:
-        "0xE1d32C985825562edAa906fAC39295370Db72195"
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      assignedPermissions.upgrade.1:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      assignedPermissions.upgrade.0:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
    }
```

Generated with discovered.json: 0x7f1bf0cfbd22aee2122754741c7e873764ddcca0

# Diff at Fri, 09 Aug 2024 10:13:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

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

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","0x235000876bd58336C802B3546Fc0250f285fCc79","0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","0x92ff91308F5f1036435f23c2F4F136Bb7475425d","0x9676D55Ccd46ce72235b16bA645008D1D3350B14","0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","0xE1d32C985825562edAa906fAC39295370Db72195","0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"]
      assignedPermissions.upgrade:
+        ["0x235000876bd58336C802B3546Fc0250f285fCc79","0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","0xE1d32C985825562edAa906fAC39295370Db72195","0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","0x9676D55Ccd46ce72235b16bA645008D1D3350B14","0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","0x92ff91308F5f1036435f23c2F4F136Bb7475425d","0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"]
      assignedPermissions.upgrade:
+        ["0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"]
    }
```

Generated with discovered.json: 0x70f3318df0a0eef88a6ef52907f9b9604e1d9995

# Diff at Tue, 30 Jul 2024 11:17:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xf0ee6b5c575977659b49d2f3bf15e9614d99cb03

# Diff at Tue, 11 Jun 2024 13:36:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b9a39f700e84af1cffa010ce0e20e64b23a4c64 block: 216517911
- current block number: 220744194

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216517911 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x24600adb45f0c6eae937f6012d3edc349679be18

# Diff at Thu, 30 May 2024 07:15:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8ee20b59ba673583fee7d27bf530e9908ec4d483 block: 214575697
- current block number: 216517911

## Description

EOA removed from executor, Caldera Multisig is now the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x37918579d1Ef6E5e7D8aF19375dF53c60d790ef6"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 214575697 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.nonce:
-        1
    }
```

Generated with discovered.json: 0xaeff0ff09760399fcb811931e82568d3e968fb35

# Diff at Fri, 24 May 2024 14:47:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ecd40c9c4c424d8e9d4fb926e97ec9da24272f20 block: 213847288
- current block number: 214575697

## Description

Ignored the feeOwner Multisig for the MOLTEN token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 213847288 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xFF93c3662B447Ec4577B51b08C6689A5518417D9)
    +++ description: None
```

Generated with discovered.json: 0x88f7271bdc94a8918dadae580fdd5b16a6b44397

# Diff at Wed, 22 May 2024 11:01:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 213847288

## Description

Initial discovery: Orbit stack L3 on Arbitrum with AnyTrust DA, custom native token, upgradable by admin EOA and Caldera Multisig.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Molten Token (0x66E535e8D2ebf13F49F3D49e5c50395a97C137b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xFF93c3662B447Ec4577B51b08C6689A5518417D9)
    +++ description: None
```
