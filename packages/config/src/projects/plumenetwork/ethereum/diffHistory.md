Generated with discovered.json: 0xc48a4cd264e2cda905e8b49a6ee122265ea6e05b

# Diff at Fri, 20 Jun 2025 06:57:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@70109db050355e01a50f54497c60fdd17bbdbc2d block: 22687092
- current block number: 22744044

## Description

Add 9 batchposters and validators (conduit).

## Watched changes

```diff
    contract RollupProxy (0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.stakerCount:
-        1
+        2
      values.validators.9:
+        "0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7"
      values.validators.8:
+        "0x8976384B54ecFeb9DEa150881008Ac43EFb27dE3"
      values.validators.7:
+        "0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C"
      values.validators.6:
+        "0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03"
      values.validators.5:
+        "0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf"
      values.validators.4:
+        "0xa017149a752BDd8723a09Cd6f40c388D38B8d202"
      values.validators.3:
+        "0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66"
      values.validators.2:
+        "0xd1e56283216127E1F40A3752735C94A13d97bc92"
      values.validators.1:
+        "0x11f563dDbF266484Dd910A401A7e44299d80b1d5"
      values.validators.0:
-        "0x8976384B54ecFeb9DEa150881008Ac43EFb27dE3"
+        "0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779"
    }
```

```diff
    contract SequencerInbox (0x85eC1b9138a8b9659A51e2b51bb0861901040b59) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.9:
+        "0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D"
      values.batchPosters.8:
+        "0x4ed0f98FB4c331e672653E832c55E0f9F402C228"
      values.batchPosters.7:
+        "0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C"
      values.batchPosters.6:
+        "0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e"
      values.batchPosters.5:
+        "0x934653eC7C396f16069D6CDaC0960e699af14B3D"
      values.batchPosters.4:
+        "0x2E8C0869C173cC07c58186E9DeEA74314635b1E2"
      values.batchPosters.3:
+        "0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e"
      values.batchPosters.2:
+        "0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe"
      values.batchPosters.1:
+        "0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36"
      values.batchPosters.0:
-        "0x934653eC7C396f16069D6CDaC0960e699af14B3D"
+        "0x17F187D978664C96ffD655996a45e085c403AD8b"
      values.setIsBatchPosterCount:
-        1
+        2
    }
```

Generated with discovered.json: 0xbc8bf251ce2690c59ab7f06357cd5053ae8730d0

# Diff at Wed, 18 Jun 2025 12:23:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22687092
- current block number: 22687092

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22687092 (main branch discovery), not current.

```diff
    contract RollupProxy (0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x419e9c1bdbdc3d01d1f35383068eb30fe6265f07

# Diff at Thu, 12 Jun 2025 14:57:53 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@707672ae07dec8237e8d9167089f62214e63e78c block: 22687092
- current block number: 22687092

## Description

Added ERC20 gateway.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22687092 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59","role":"admin","via":[{"address":"ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"},{"address":"ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0xf576102530749344D2f4C04D15C2B8609c7897ea","role":"admin","via":[{"address":"ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"},{"address":"ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"}]}
      receivedPermissions.8.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "ethereum:0x35381f63091926750F43b2A7401B083263aDEF83"
      receivedPermissions.7.from:
-        "ethereum:0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "ethereum:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
      receivedPermissions.6.from:
-        "ethereum:0x35381f63091926750F43b2A7401B083263aDEF83"
+        "ethereum:0xE2C902BC61296531e556962ffC81A082b82f5F28"
    }
```

```diff
    contract ProxyAdmin (0xb90fe445014e74eA5aA7681291212bfEa37031CC) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59","role":"admin"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"ethereum:0xf576102530749344D2f4C04D15C2B8609c7897ea","role":"admin"}
      directlyReceivedPermissions.6.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "ethereum:0x35381f63091926750F43b2A7401B083263aDEF83"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "ethereum:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x35381f63091926750F43b2A7401B083263aDEF83"
+        "ethereum:0xE2C902BC61296531e556962ffC81A082b82f5F28"
    }
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0xE2C902BC61296531e556962ffC81A082b82f5F28)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

Generated with discovered.json: 0x24ece6c1daee9d67f101f3d207a9de23743165f9

# Diff at Thu, 12 Jun 2025 08:03:20 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 22687092

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0537c93dA3b1f8A525204165d1d93De0534c262f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x35381f63091926750F43b2A7401B083263aDEF83)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0x7e4627bC114Fcd12ba912103279FD2858E644E71)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x856EA788977Bc771E8Ca87471baeC507A0f54771)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) as source of truth for the DA referenced by the fault proof.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x85eC1b9138a8b9659A51e2b51bb0861901040b59)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Inbox (0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb90fe445014e74eA5aA7681291212bfEa37031CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xd688dabDBb14D673898689135a23a174560c8C04)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xf576102530749344D2f4C04D15C2B8609c7897ea)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```
