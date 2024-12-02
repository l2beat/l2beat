Generated with discovered.json: 0x70fcf8c7290d5f3b5b69bc20ecada2d67f7a26e0

# Diff at Fri, 29 Nov 2024 11:28:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.via.1:
-        {"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
+        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      receivedPermissions.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
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
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.0.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0,"description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xe21f77939a0f885e34e6c1f072076979f9a711e4

# Diff at Fri, 29 Nov 2024 09:31:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}]}
      receivedPermissions.7.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.7.via.1:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      receivedPermissions.7.via.0.address:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.6.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.5.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.4.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.3.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.2.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.1.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.via.1:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      receivedPermissions.0.via.0.address:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","target":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","via":[]}
      issuedPermissions.5.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.4.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.3.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xf51f16b4c673509075e65ad9b16a469486062035

# Diff at Mon, 18 Nov 2024 16:54:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 272297655
- current block number: 275817298

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

Generated with discovered.json: 0xc1c8c787d4349fb65902fc9d8e50fa3b53599d8f

# Diff at Fri, 15 Nov 2024 08:18:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 272297655
- current block number: 272297655

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 272297655 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"propose","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.1.permission:
-        "configure"
+        "validate"
      receivedPermissions.1.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.permission:
-        "challenge"
+        "configure"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
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
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.9:
-        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}]}
      issuedPermissions.8:
-        {"permission":"propose","target":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","via":[]}
      issuedPermissions.7:
-        {"permission":"propose","target":"0x571D6CA61B979A967E055696c822CF8C928d3556","via":[]}
      issuedPermissions.6:
-        {"permission":"propose","target":"0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De","via":[]}
      issuedPermissions.5.permission:
-        "propose"
+        "validate"
      issuedPermissions.5.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.4.permission:
-        "configure"
+        "validate"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
    }
```

Generated with discovered.json: 0x559fb671bc7d281ff267dd97b4968edd6835ec80

# Diff at Fri, 08 Nov 2024 11:02:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 272297655

## Description

Initial discovery of a standard Orbit stack Optimium with 3/3 DAC and 3/3 fastconfirmer MS.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```
