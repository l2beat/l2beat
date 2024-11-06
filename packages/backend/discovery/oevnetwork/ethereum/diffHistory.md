Generated with discovered.json: 0x09a596b323acf8d9759963ac35076444a3585e63

# Diff at Mon, 04 Nov 2024 07:57:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xe4F99a0734C87C298d73C161F54874225E416997","via":[{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"},{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]}
      receivedPermissions.7.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.6.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.5.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.4.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.3.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.3.via.1:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.3.via.0.address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.2.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.2.via.1:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.2.via.0.address:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.1.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.0.via.1:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.0.via.0.address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.via.0:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.0:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x897f4c13409d49ae727c1f15bf64d9ea95dfa1e4

# Diff at Thu, 31 Oct 2024 09:08:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21084619

## Description

Initial discovery of a standard orbit stack optimium. (`xchain => oevnetwork @ 1.00`)

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
