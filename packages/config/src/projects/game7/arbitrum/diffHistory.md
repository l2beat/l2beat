Generated with discovered.json: 0x7a5b6419a073b54b8266d44e58e0a2197c0e899e

# Diff at Tue, 15 Jul 2025 11:01:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 356573936
- current block number: 357933310

## Description

USDC escrow ownership txfered to Conduit (from EOA).

## Watched changes

```diff
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D) {
    +++ description: None
      values.owner:
-        "arb1:0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      values.owner:
-        "arb1:0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"arb1:0x404922a9B29b4a5205a6074AbA31A7392BD28944","role":"admin","via":[{"address":"arb1:0x401eCb1D350407f13ba348573E5630B83638E30D"}]}
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"arb1:0x401eCb1D350407f13ba348573E5630B83638E30D","role":".owner"}
    }
```

Generated with discovered.json: 0x20260e62feeb03ce0df82e4b898912c965906cf9

# Diff at Mon, 14 Jul 2025 12:44:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 356573936
- current block number: 356573936

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 356573936 (main branch discovery), not current.

```diff
    EOA  (0x026919DbCFab70a2A45775088C933331A7B25Ac6) {
    +++ description: None
      address:
-        "0x026919DbCFab70a2A45775088C933331A7B25Ac6"
+        "arb1:0x026919DbCFab70a2A45775088C933331A7B25Ac6"
    }
```

```diff
    contract OneStepProverHostIo (0x0446E34D1cC4eBA5F336627BaAe82332c8607043) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0446E34D1cC4eBA5F336627BaAe82332c8607043"
+        "arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043"
      implementationNames.0x0446E34D1cC4eBA5F336627BaAe82332c8607043:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x053970A9AA9638F54370764E6E9c7B2f5854Ef21) {
    +++ description: None
      address:
-        "0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
+        "arb1:0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
    }
```

```diff
    contract ValidatorUtils (0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a"
+        "arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a"
      implementationNames.0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a:
-        "ValidatorUtils"
      implementationNames.arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a:
+        "ValidatorUtils"
    }
```

```diff
    EOA  (0x0C79a90C94E1C1091D7D3a188730105be00798f9) {
    +++ description: None
      address:
-        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
+        "arb1:0x0C79a90C94E1C1091D7D3a188730105be00798f9"
    }
```

```diff
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc) {
    +++ description: None
      address:
-        "0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
+        "arb1:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "arb1:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
+        "arb1:0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
      implementationNames.0x1a8902780F37e0526788198Dee30b8375A0B24Bc:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.arb1:0x1a8902780F37e0526788198Dee30b8375A0B24Bc:
+        "GnosisSafeProxy"
      implementationNames.arb1:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E) {
    +++ description: None
      address:
-        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
+        "arb1:0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
    }
```

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE"
+        "arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE"
      values.$pastUpgrades.0.2.0:
-        "0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE"
+        "arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+        "arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+        "arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+        "arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
      values.nativeToken:
-        "0xF18e4466F26B4cA55bbAb890b314a54976E45B17"
+        "arb1:0xF18e4466F26B4cA55bbAb890b314a54976E45B17"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+        "arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
      values.rollup:
-        "0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      values.sequencerInbox:
-        "0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      implementationNames.0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e:
-        "TransparentUpgradeableProxy"
      implementationNames.0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE:
-        "ERC20Bridge"
      implementationNames.arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE:
+        "ERC20Bridge"
    }
```

```diff
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x23264394923E4aEB990234180c37Bf757667C6f7"
+        "arb1:0x23264394923E4aEB990234180c37Bf757667C6f7"
      values.prover0:
-        "0x91F12800C6b5b4e7d88fE785558213F8EF3F4586"
+        "arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586"
      values.proverHostIo:
-        "0x0446E34D1cC4eBA5F336627BaAe82332c8607043"
+        "arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043"
      values.proverMath:
-        "0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5"
+        "arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5"
      values.proverMem:
-        "0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351"
+        "arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351"
      implementationNames.0x23264394923E4aEB990234180c37Bf757667C6f7:
-        "OneStepProofEntry"
      implementationNames.arb1:0x23264394923E4aEB990234180c37Bf757667C6f7:
+        "OneStepProofEntry"
    }
```

```diff
    EOA  (0x336dD5a1aB948058E4c699fD7732c2AA78C10d90) {
    +++ description: None
      address:
-        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
+        "arb1:0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
    }
```

```diff
    EOA  (0x36921bAAD215c5f3c5dffa89B1C2A5CF4BDAdC77) {
    +++ description: None
      address:
-        "0x36921bAAD215c5f3c5dffa89B1C2A5CF4BDAdC77"
+        "arb1:0x36921bAAD215c5f3c5dffa89B1C2A5CF4BDAdC77"
    }
```

```diff
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "arb1:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    EOA  (0x3944783afD953e76cD41d8967772468eeB1bC576) {
    +++ description: None
      address:
-        "0x3944783afD953e76cD41d8967772468eeB1bC576"
+        "arb1:0x3944783afD953e76cD41d8967772468eeB1bC576"
    }
```

```diff
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351"
+        "arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351"
      implementationNames.0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351:
-        "OneStepProverMemory"
      implementationNames.arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351:
+        "OneStepProverMemory"
    }
```

```diff
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D) {
    +++ description: None
      address:
-        "0x401eCb1D350407f13ba348573E5630B83638E30D"
+        "arb1:0x401eCb1D350407f13ba348573E5630B83638E30D"
      values.owner:
-        "0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
+        "arb1:0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
      implementationNames.0x401eCb1D350407f13ba348573E5630B83638E30D:
-        "ProxyAdmin"
      implementationNames.arb1:0x401eCb1D350407f13ba348573E5630B83638E30D:
+        "ProxyAdmin"
    }
```

```diff
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0x404922a9B29b4a5205a6074AbA31A7392BD28944"
+        "arb1:0x404922a9B29b4a5205a6074AbA31A7392BD28944"
      values.$admin:
-        "0x401eCb1D350407f13ba348573E5630B83638E30D"
+        "arb1:0x401eCb1D350407f13ba348573E5630B83638E30D"
      values.$implementation:
-        "0x5625F3f678087335BfA11c2b41E7582D3414431F"
+        "arb1:0x5625F3f678087335BfA11c2b41E7582D3414431F"
      values.$pastUpgrades.0.2.0:
-        "0x5625F3f678087335BfA11c2b41E7582D3414431F"
+        "arb1:0x5625F3f678087335BfA11c2b41E7582D3414431F"
      values.burner:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.counterpartGateway:
-        "0xF70ae1Af7D49dA0f7D66Bb55469caC9da336181b"
+        "arb1:0xF70ae1Af7D49dA0f7D66Bb55469caC9da336181b"
      values.inbox:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      values.l1USDC:
-        "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
+        "arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
      values.l2USDC:
-        "0x401eCb1D350407f13ba348573E5630B83638E30D"
+        "arb1:0x401eCb1D350407f13ba348573E5630B83638E30D"
      values.owner:
-        "0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
+        "arb1:0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
      values.router:
-        "0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
+        "arb1:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
      implementationNames.0x404922a9B29b4a5205a6074AbA31A7392BD28944:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5625F3f678087335BfA11c2b41E7582D3414431F:
-        "L1OrbitUSDCGateway"
      implementationNames.arb1:0x404922a9B29b4a5205a6074AbA31A7392BD28944:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x5625F3f678087335BfA11c2b41E7582D3414431F:
+        "L1OrbitUSDCGateway"
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+        "arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653"
+        "arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653"
      values.$pastUpgrades.0.2.0:
-        "0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653"
+        "arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653"
      values.bridge:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.rollup:
-        "0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      implementationNames.0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5"
+        "arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5"
      implementationNames.0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5:
-        "OneStepProverMath"
      implementationNames.arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5:
+        "OneStepProverMath"
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.0.2.0:
-        "0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"
+        "arb1:0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"
      values.$pastUpgrades.1.2.0:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
+        "arb1:0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
      values.batchPosters.1:
-        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
+        "arb1:0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
      values.batchPosters.2:
-        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
+        "arb1:0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
      values.batchPosters.3:
-        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
+        "arb1:0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
      values.batchPosters.4:
-        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
+        "arb1:0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
      values.batchPosters.5:
-        "0x79F4b4f9103298460486EC644499Df9985E34170"
+        "arb1:0x79F4b4f9103298460486EC644499Df9985E34170"
      values.batchPosters.6:
-        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
+        "arb1:0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
      values.batchPosters.7:
-        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
+        "arb1:0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
      values.batchPosters.8:
-        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
+        "arb1:0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
      values.batchPosters.9:
-        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
+        "arb1:0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
      values.batchPosters.10:
-        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
+        "arb1:0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
      values.batchPosters.11:
-        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
+        "arb1:0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
      values.batchPosters.12:
-        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
+        "arb1:0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
      values.batchPosters.13:
-        "0xbE119cCc44373B15517e921e9a7D54362250662D"
+        "arb1:0xbE119cCc44373B15517e921e9a7D54362250662D"
      values.bridge:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      implementationNames.0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7be08B013de2b23a6329De51C4994f841dcE1a10:
-        "SequencerInbox"
      implementationNames.arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10:
+        "SequencerInbox"
    }
```

```diff
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "arb1:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    EOA  (0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5) {
    +++ description: None
      address:
-        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
+        "arb1:0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "arb1:0x50930d652266EF4127FA3A1906B7Cb9951076628"
    }
```

```diff
    EOA  (0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885) {
    +++ description: None
      address:
-        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
+        "arb1:0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
    }
```

```diff
    EOA  (0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31) {
    +++ description: None
      address:
-        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
+        "arb1:0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
    }
```

```diff
    EOA  (0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a) {
    +++ description: None
      address:
-        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
+        "arb1:0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      values.$admin:
-        "0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      values.$implementation.0:
-        "0x87A5B85A1C26512898AeB01038F0e64539C6761F"
+        "arb1:0x87A5B85A1C26512898AeB01038F0e64539C6761F"
      values.$implementation.1:
-        "0x4916F2075d54e03855959B09B41aD442B2966d20"
+        "arb1:0x4916F2075d54e03855959B09B41aD442B2966d20"
      values.$pastUpgrades.0.2.0:
-        "0x87A5B85A1C26512898AeB01038F0e64539C6761F"
+        "arb1:0x87A5B85A1C26512898AeB01038F0e64539C6761F"
      values.$pastUpgrades.0.2.1:
-        "0x4916F2075d54e03855959B09B41aD442B2966d20"
+        "arb1:0x4916F2075d54e03855959B09B41aD442B2966d20"
      values.anyTrustFastConfirmer:
-        "0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
+        "arb1:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
      values.bridge:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.challengeManager:
-        "0x832CF28be3042b6F60D7225E393E924D7f0936F6"
+        "arb1:0x832CF28be3042b6F60D7225E393E924D7f0936F6"
      values.inbox:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+        "arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
      values.owner:
-        "0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      values.rollupEventInbox:
-        "0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+        "arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
      values.sequencerInbox:
-        "0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x026919DbCFab70a2A45775088C933331A7B25Ac6"
+        "arb1:0x026919DbCFab70a2A45775088C933331A7B25Ac6"
      values.validators.1:
-        "0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
+        "arb1:0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
      values.validators.2:
-        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
+        "arb1:0x0C79a90C94E1C1091D7D3a188730105be00798f9"
      values.validators.3:
-        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
+        "arb1:0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
      values.validators.4:
-        "0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
+        "arb1:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
      values.validators.5:
-        "0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
+        "arb1:0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
      values.validators.6:
-        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
+        "arb1:0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
      values.validators.7:
-        "0x83433d51B327392aA694455231D2db092eE2A5Db"
+        "arb1:0x83433d51B327392aA694455231D2db092eE2A5Db"
      values.validators.8:
-        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
+        "arb1:0xB180d28c01D3248C3fa88d67154a5070e5039135"
      values.validators.9:
-        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
+        "arb1:0xC929c820dC03C2a22e44F440721Af3c835e071fc"
      values.validators.10:
-        "0xD47FB043557CB2289B31d813dd4BC1223C91f872"
+        "arb1:0xD47FB043557CB2289B31d813dd4BC1223C91f872"
      values.validators.11:
-        "0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
+        "arb1:0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
      values.validators.12:
-        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
+        "arb1:0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
      values.validators.13:
-        "0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
+        "arb1:0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
      values.validators.14:
-        "0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
+        "arb1:0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
      values.validatorUtils:
-        "0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a"
+        "arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a"
      values.validatorWalletCreator:
-        "0x27a722f5Ba1E7119a48A990eE5C262413249eB2B"
+        "arb1:0x27a722f5Ba1E7119a48A990eE5C262413249eB2B"
      implementationNames.0x60DAdF13101C66F14C958E9141498b0C0eaE0773:
-        "RollupProxy"
      implementationNames.0x87A5B85A1C26512898AeB01038F0e64539C6761F:
-        "RollupAdminLogic"
      implementationNames.0x4916F2075d54e03855959B09B41aD442B2966d20:
-        "RollupUserLogic"
      implementationNames.arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773:
+        "RollupProxy"
      implementationNames.arb1:0x87A5B85A1C26512898AeB01038F0e64539C6761F:
+        "RollupAdminLogic"
      implementationNames.arb1:0x4916F2075d54e03855959B09B41aD442B2966d20:
+        "RollupUserLogic"
    }
```

```diff
    EOA  (0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB) {
    +++ description: None
      address:
-        "0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
+        "arb1:0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      address:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "arb1:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "arb1:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "arb1:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "arb1:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.5:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "arb1:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "arb1:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "arb1:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "arb1:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.9:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "arb1:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.10:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "arb1:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      implementationNames.0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x79F4b4f9103298460486EC644499Df9985E34170) {
    +++ description: None
      address:
-        "0x79F4b4f9103298460486EC644499Df9985E34170"
+        "arb1:0x79F4b4f9103298460486EC644499Df9985E34170"
    }
```

```diff
    EOA  (0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7) {
    +++ description: None
      address:
-        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
+        "arb1:0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
    }
```

```diff
    EOA  (0x7Ca9c81d2AdD8bff46CEE9813d52bD84d94901DD) {
    +++ description: None
      address:
-        "0x7Ca9c81d2AdD8bff46CEE9813d52bD84d94901DD"
+        "arb1:0x7Ca9c81d2AdD8bff46CEE9813d52bD84d94901DD"
    }
```

```diff
    EOA  (0x7CD925c107dE5C06C100F2084bFA0422F21140f0) {
    +++ description: None
      address:
-        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
+        "arb1:0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
+        "arb1:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
+        "arb1:0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
      values.$pastUpgrades.0.2.0:
-        "0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
+        "arb1:0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
      values.counterpartGateway:
-        "0x7Ca9c81d2AdD8bff46CEE9813d52bD84d94901DD"
+        "arb1:0x7Ca9c81d2AdD8bff46CEE9813d52bD84d94901DD"
      values.defaultGateway:
-        "0xe41363751bd1C305384375F428585C20e3dF516A"
+        "arb1:0xe41363751bd1C305384375F428585C20e3dF516A"
      values.inbox:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      values.owner:
-        "0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe:
-        "L1OrbitGatewayRouter"
      implementationNames.arb1:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe:
+        "L1OrbitGatewayRouter"
    }
```

```diff
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x832CF28be3042b6F60D7225E393E924D7f0936F6"
+        "arb1:0x832CF28be3042b6F60D7225E393E924D7f0936F6"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0x2A8ccC4829c0323b470357cffDaD492C789f9315"
+        "arb1:0x2A8ccC4829c0323b470357cffDaD492C789f9315"
      values.$pastUpgrades.0.2.0:
-        "0x2A8ccC4829c0323b470357cffDaD492C789f9315"
+        "arb1:0x2A8ccC4829c0323b470357cffDaD492C789f9315"
      values.bridge:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.osp:
-        "0x23264394923E4aEB990234180c37Bf757667C6f7"
+        "arb1:0x23264394923E4aEB990234180c37Bf757667C6f7"
      values.resultReceiver:
-        "0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      values.sequencerInbox:
-        "0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      implementationNames.0x832CF28be3042b6F60D7225E393E924D7f0936F6:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2A8ccC4829c0323b470357cffDaD492C789f9315:
-        "ChallengeManager"
      implementationNames.arb1:0x832CF28be3042b6F60D7225E393E924D7f0936F6:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x2A8ccC4829c0323b470357cffDaD492C789f9315:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x83433d51B327392aA694455231D2db092eE2A5Db) {
    +++ description: None
      address:
-        "0x83433d51B327392aA694455231D2db092eE2A5Db"
+        "arb1:0x83433d51B327392aA694455231D2db092eE2A5Db"
    }
```

```diff
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "arb1:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0xb6298031A9536600EBB8B59f3DD24b0e33d86008"
+        "arb1:0xb6298031A9536600EBB8B59f3DD24b0e33d86008"
      values.$pastUpgrades.0.2.0:
-        "0xb6298031A9536600EBB8B59f3DD24b0e33d86008"
+        "arb1:0xb6298031A9536600EBB8B59f3DD24b0e33d86008"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      values.executors.0:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      implementationNames.0x8b2600BA65E7908D38Af906fbcafB2f62D395765:
-        "TransparentUpgradeableProxy"
      implementationNames.0xb6298031A9536600EBB8B59f3DD24b0e33d86008:
-        "UpgradeExecutor"
      implementationNames.arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xb6298031A9536600EBB8B59f3DD24b0e33d86008:
+        "UpgradeExecutor"
    }
```

```diff
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x91F12800C6b5b4e7d88fE785558213F8EF3F4586"
+        "arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586"
      implementationNames.0x91F12800C6b5b4e7d88fE785558213F8EF3F4586:
-        "OneStepProver0"
      implementationNames.arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0x936cCC684c091b20806fA3C6668F7F1fD2B3C772) {
    +++ description: None
      address:
-        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
+        "arb1:0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
    }
```

```diff
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "arb1:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "arb1:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "arb1:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    EOA  (0xa65100caA20c06Bd278D83C60475ec4F69b23dc1) {
    +++ description: None
      address:
-        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
+        "arb1:0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.0.2.0:
-        "0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"
+        "arb1:0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"
      values.$pastUpgrades.1.2.0:
-        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.bridge:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.getProxyAdmin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.sequencerInbox:
-        "0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      implementationNames.0xB1146A7eb098ECF46e8AAf695f4A960A963948d6:
-        "TransparentUpgradeableProxy"
      implementationNames.0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
-        "ERC20Inbox"
      implementationNames.arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
+        "ERC20Inbox"
    }
```

```diff
    EOA  (0xB180d28c01D3248C3fa88d67154a5070e5039135) {
    +++ description: None
      address:
-        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
+        "arb1:0xB180d28c01D3248C3fa88d67154a5070e5039135"
    }
```

```diff
    EOA  (0xbE119cCc44373B15517e921e9a7D54362250662D) {
    +++ description: None
      address:
-        "0xbE119cCc44373B15517e921e9a7D54362250662D"
+        "arb1:0xbE119cCc44373B15517e921e9a7D54362250662D"
    }
```

```diff
    EOA  (0xC929c820dC03C2a22e44F440721Af3c835e071fc) {
    +++ description: None
      address:
-        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
+        "arb1:0xC929c820dC03C2a22e44F440721Af3c835e071fc"
    }
```

```diff
    EOA  (0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F) {
    +++ description: None
      address:
-        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
+        "arb1:0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
    }
```

```diff
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E) {
    +++ description: None
      address:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.owner:
-        "0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      implementationNames.0xd12478d6edD1db996313E2F4350F2FD99c118B6E:
-        "ProxyAdmin"
      implementationNames.arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xD327b75C2CA829835b2B5EA9535827e9a06a480B) {
    +++ description: None
      address:
-        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
+        "arb1:0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
    }
```

```diff
    EOA  (0xD47FB043557CB2289B31d813dd4BC1223C91f872) {
    +++ description: None
      address:
-        "0xD47FB043557CB2289B31d813dd4BC1223C91f872"
+        "arb1:0xD47FB043557CB2289B31d813dd4BC1223C91f872"
    }
```

```diff
    EOA  (0xD6433a681832BD2020fc6d984Efb5f57fe9ac155) {
    +++ description: None
      address:
-        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
+        "arb1:0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
    }
```

```diff
    EOA  (0xd76a3aCEd4115B017301C54C211EC36aA5E37e05) {
    +++ description: None
      address:
-        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
+        "arb1:0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
    }
```

```diff
    EOA  (0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176) {
    +++ description: None
      address:
-        "0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
+        "arb1:0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176"
    }
```

```diff
    EOA  (0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc) {
    +++ description: None
      address:
-        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
+        "arb1:0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0xe41363751bd1C305384375F428585C20e3dF516A"
+        "arb1:0xe41363751bd1C305384375F428585C20e3dF516A"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
+        "arb1:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
      values.$pastUpgrades.0.2.0:
-        "0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
+        "arb1:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
      values.counterpartGateway:
-        "0x36921bAAD215c5f3c5dffa89B1C2A5CF4BDAdC77"
+        "arb1:0x36921bAAD215c5f3c5dffa89B1C2A5CF4BDAdC77"
      values.inbox:
-        "0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      values.l2BeaconProxyFactory:
-        "0x3944783afD953e76cD41d8967772468eeB1bC576"
+        "arb1:0x3944783afD953e76cD41d8967772468eeB1bC576"
      values.router:
-        "0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
+        "arb1:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xe41363751bd1C305384375F428585C20e3dF516A:
-        "TransparentUpgradeableProxy"
      implementationNames.0x8b73Ef238ADaB31EBC7c05423d243c345241a22f:
-        "L1OrbitERC20Gateway"
      implementationNames.arb1:0xe41363751bd1C305384375F428585C20e3dF516A:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f:
+        "L1OrbitERC20Gateway"
    }
```

```diff
    EOA  (0xe7685c09633B47Fe123ff47ebeA903C3763924a2) {
    +++ description: None
      address:
-        "0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
+        "arb1:0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
    }
```

```diff
    EOA  (0xEBe1766201dd69A09a2953B08081829E90f4a8d3) {
    +++ description: None
      address:
-        "0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
+        "arb1:0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "arb1:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "arb1:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "arb1:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    EOA  (0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822) {
    +++ description: None
      address:
-        "0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
+        "arb1:0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+        "arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
      values.$admin:
-        "0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      values.$implementation:
-        "0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A"
+        "arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A"
      values.$pastUpgrades.0.2.0:
-        "0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A"
+        "arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A"
      values.bridge:
-        "0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      implementationNames.0xfbe537816d181888fAbE52338a5D921eE131E9Db:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A:
-        "ERC20Outbox"
      implementationNames.arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A:
+        "ERC20Outbox"
    }
```

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
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944)
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

Generated with discovered.json: 0x9a5714c13c7cc7ca90dd882e49a11c94d4626a6a

# Diff at Fri, 11 Jul 2025 12:39:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 350404779
- current block number: 356573936

## Description

operator addresses changed.

## Watched changes

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.14:
-        "0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A"
      values.setIsBatchPosterCount:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.stakerCount:
-        2
+        1
      values.validators.8:
-        "0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0"
    }
```

Generated with discovered.json: 0x2f9089b9801de1c19a4007263a90c1fa6ef60000

# Diff at Fri, 04 Jul 2025 12:19:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 350404779
- current block number: 350404779

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 350404779 (main branch discovery), not current.

```diff
    EOA  (0x026919DbCFab70a2A45775088C933331A7B25Ac6) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0x053970A9AA9638F54370764E6E9c7B2f5854Ef21) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0x0C79a90C94E1C1091D7D3a188730105be00798f9) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
+        "arb1:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
+        "arb1:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
      receivedPermissions.1.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      receivedPermissions.2.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0x336dD5a1aB948058E4c699fD7732c2AA78C10d90) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x404922a9B29b4a5205a6074AbA31A7392BD28944"
+        "arb1:0x404922a9B29b4a5205a6074AbA31A7392BD28944"
    }
```

```diff
    EOA  (0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.1.from:
-        "arbitrum:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.2.from:
-        "arbitrum:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+        "arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.3.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.4.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.5.from:
-        "arbitrum:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
+        "arb1:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.6.from:
-        "arbitrum:0x832CF28be3042b6F60D7225E393E924D7f0936F6"
+        "arb1:0x832CF28be3042b6F60D7225E393E924D7f0936F6"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.7.from:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.8.from:
-        "arbitrum:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      receivedPermissions.9.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.9.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.9.from:
-        "arbitrum:0xe41363751bd1C305384375F428585C20e3dF516A"
+        "arb1:0xe41363751bd1C305384375F428585C20e3dF516A"
      receivedPermissions.10.via.1.address:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      receivedPermissions.10.via.0.address:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      receivedPermissions.10.from:
-        "arbitrum:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+        "arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
    }
```

```diff
    EOA  (0x79F4b4f9103298460486EC644499Df9985E34170) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0x7CD925c107dE5C06C100F2084bFA0422F21140f0) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x83433d51B327392aA694455231D2db092eE2A5Db) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
+        "arb1:0xd12478d6edD1db996313E2F4350F2FD99c118B6E"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0x936cCC684c091b20806fA3C6668F7F1fD2B3C772) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xa65100caA20c06Bd278D83C60475ec4F69b23dc1) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0xB180d28c01D3248C3fa88d67154a5070e5039135) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xbE119cCc44373B15517e921e9a7D54362250662D) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0xC929c820dC03C2a22e44F440721Af3c835e071fc) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
+        "arb1:0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
+        "arb1:0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
+        "arb1:0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0x832CF28be3042b6F60D7225E393E924D7f0936F6"
+        "arb1:0x832CF28be3042b6F60D7225E393E924D7f0936F6"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
+        "arb1:0x8b2600BA65E7908D38Af906fbcafB2f62D395765"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
+        "arb1:0xB1146A7eb098ECF46e8AAf695f4A960A963948d6"
      directlyReceivedPermissions.7.from:
-        "arbitrum:0xe41363751bd1C305384375F428585C20e3dF516A"
+        "arb1:0xe41363751bd1C305384375F428585C20e3dF516A"
      directlyReceivedPermissions.8.from:
-        "arbitrum:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
+        "arb1:0xfbe537816d181888fAbE52338a5D921eE131E9Db"
    }
```

```diff
    EOA  (0xD327b75C2CA829835b2B5EA9535827e9a06a480B) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0xD47FB043557CB2289B31d813dd4BC1223C91f872) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xD6433a681832BD2020fc6d984Efb5f57fe9ac155) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0xd76a3aCEd4115B017301C54C211EC36aA5E37e05) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x401eCb1D350407f13ba348573E5630B83638E30D"
+        "arb1:0x401eCb1D350407f13ba348573E5630B83638E30D"
      receivedPermissions.0.from:
-        "arbitrum:0x404922a9B29b4a5205a6074AbA31A7392BD28944"
+        "arb1:0x404922a9B29b4a5205a6074AbA31A7392BD28944"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x401eCb1D350407f13ba348573E5630B83638E30D"
+        "arb1:0x401eCb1D350407f13ba348573E5630B83638E30D"
    }
```

```diff
    EOA  (0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
+        "arb1:0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68"
    }
```

```diff
    EOA  (0xe7685c09633B47Fe123ff47ebeA903C3763924a2) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xEBe1766201dd69A09a2953B08081829E90f4a8d3) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

```diff
    EOA  (0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
+        "arb1:0x60DAdF13101C66F14C958E9141498b0C0eaE0773"
    }
```

Generated with discovered.json: 0x75cc86bd6269ca3ffcc3cbd2adb15c21bb5a8af6

# Diff at Mon, 23 Jun 2025 15:23:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@399f5abaefa11c25467c604969aa558f53a49aa0 block: 343817776
- current block number: 350404779

## Description

Conduit: add 14 permissioned sequencers / validators.

## Watched changes

```diff
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc) {
    +++ description: None
      values.$members.0:
-        "0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0"
+        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.14:
+        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
      values.batchPosters.13:
+        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
      values.batchPosters.12:
+        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
      values.batchPosters.11:
+        "0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A"
      values.batchPosters.10:
+        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
      values.batchPosters.9:
+        "0x79F4b4f9103298460486EC644499Df9985E34170"
      values.batchPosters.8:
+        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
      values.batchPosters.7:
+        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
      values.batchPosters.6:
+        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
      values.batchPosters.5:
+        "0xbE119cCc44373B15517e921e9a7D54362250662D"
      values.batchPosters.4:
+        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
      values.batchPosters.3:
+        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
      values.batchPosters.2:
+        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
      values.batchPosters.1:
+        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
      values.batchPosters.0:
-        "0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A"
+        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
      values.setIsBatchPosterCount:
-        1
+        2
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
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
+        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
      values.validators.13:
+        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
      values.validators.12:
+        "0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0"
      values.validators.11:
+        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
      values.validators.10:
+        "0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
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
-        "0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0"
+        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
      values.validators.0:
-        "0x1a8902780F37e0526788198Dee30b8375A0B24Bc"
+        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
    }
```

```diff
    EOA  (0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"fastconfirm","from":"arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"arbitrum:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]}
      receivedPermissions.1:
-        {"permission":"validate","from":"arbitrum:0x60DAdF13101C66F14C958E9141498b0C0eaE0773","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"arbitrum:0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]}
    }
```

Generated with discovered.json: 0x4c11f760aad83c3b3f1378fd2ab89d50c1baf118

# Diff at Wed, 18 Jun 2025 12:22:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 343817776
- current block number: 343817776

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 343817776 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x76b2e47cc9874ee7b38f58a5a10da539dface260

# Diff at Wed, 04 Jun 2025 12:23:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 331093646
- current block number: 343817776

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

Generated with discovered.json: 0x31fdc60e78d46aeeb6b372222923e8bcb423cd43

# Diff at Tue, 27 May 2025 08:31:05 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 331093646
- current block number: 331093646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331093646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
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

Generated with discovered.json: 0x5ad1a923eb493bab980cd7dff2539f161d111229

# Diff at Fri, 23 May 2025 09:41:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 331093646
- current block number: 331093646

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331093646 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc) {
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
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
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
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
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
    EOA  (0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0) {
    +++ description: None
      receivedPermissions.2.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.2.via:
+        [{"address":"0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]
      receivedPermissions.1.via:
-        [{"address":"0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]
      receivedPermissions.1.role:
+        ".validators"
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E) {
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
    EOA  (0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

Generated with discovered.json: 0xe898469cb74cf4a30e82db13b54cdb104f475d20

# Diff at Fri, 02 May 2025 17:25:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 331093646
- current block number: 331093646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331093646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x744d7b474e3fad3714db8ec3e3666afbd4275fd8

# Diff at Tue, 29 Apr 2025 08:19:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 331093646
- current block number: 331093646

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331093646 (main branch discovery), not current.

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176","via":[{"address":"0x401eCb1D350407f13ba348573E5630B83638E30D"}]}]
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]},{"permission":"interact","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"}]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"}]},{"permission":"validate","to":"0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]}]
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

Generated with discovered.json: 0xb2b394853a1be0b6ba3f763d134813f3bb8410d7

# Diff at Mon, 28 Apr 2025 12:22:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 315644612
- current block number: 331093646

## Description

Minor Arbitrum upgrade [3.1.0](https://github.com/OffchainLabs/nitro-contracts/releases/tag/v3.1.0) that everyone is doing atm.

## Watched changes

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"
+        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2024-10-10T10:37:46.000Z","0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955",["0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"]]
      values.$pastUpgrades.0.2:
-        "0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955"
+        ["0x7be08B013de2b23a6329De51C4994f841dcE1a10"]
      values.$pastUpgrades.0.1:
-        ["0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"]
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.0:
-        "2024-10-10T10:37:46.000Z"
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"
+        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2024-10-10T10:37:46.000Z","0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955",["0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"]]
      values.$pastUpgrades.0.2:
-        "0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955"
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.1:
-        "2024-10-10T10:37:46.000Z"
+        ["0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]
      values.$pastUpgrades.0.0:
-        ["0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"]
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xbc6c39ea769a858dcff698275f6a735259cdf19f

# Diff at Tue, 18 Mar 2025 08:14:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 315644612
- current block number: 315644612

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 315644612 (main branch discovery), not current.

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "ConduitMultisig2"
+        "Conduit Multisig 2"
    }
```

Generated with discovered.json: 0xbc54239fd21b3591ac38e25c2056236f85cd9dfc

# Diff at Fri, 14 Mar 2025 15:36:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 307386152
- current block number: 315644612

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.9:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.8:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.7:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.6:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.5:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.3:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 9 (33%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x849e6589b622c80752ae0e310f6c2724f624b6a4

# Diff at Thu, 06 Mar 2025 14:22:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 307386152
- current block number: 307386152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xb225e744764d4a62f3095cc78892678e27d748eb

# Diff at Thu, 06 Mar 2025 09:39:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 307386152
- current block number: 307386152

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xB1146A7eb098ECF46e8AAf695f4A960A963948d6","0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xfbe537816d181888fAbE52338a5D921eE131E9Db"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x53a6794224ed9fd45d590803c8458821850a457e

# Diff at Tue, 04 Mar 2025 10:40:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 307386152
- current block number: 307386152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0446E34D1cC4eBA5F336627BaAe82332c8607043) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391505
    }
```

```diff
    contract ValidatorUtils (0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        248391713
    }
```

```diff
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc) {
    +++ description: None
      sinceBlock:
+        305565943
    }
```

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        262322617
    }
```

```diff
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391542
    }
```

```diff
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391437
    }
```

```diff
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D) {
    +++ description: None
      sinceBlock:
+        269256275
    }
```

```diff
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        269256316
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        262322617
    }
```

```diff
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391475
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        262322617
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        262322617
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sinceBlock:
+        155965667
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        262324820
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        262322617
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        262322617
    }
```

```diff
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391392
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        262322617
    }
```

```diff
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E) {
    +++ description: None
      sinceBlock:
+        262322617
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        262324820
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        262322617
    }
```

Generated with discovered.json: 0xce8124c25eb368f755faf234ee65b8697b49ddf5

# Diff at Thu, 27 Feb 2025 11:47:25 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 307386152
- current block number: 307386152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

Generated with discovered.json: 0x0e14bad2f617d975b759e90138fd2de8ff23e3f6

# Diff at Fri, 21 Feb 2025 14:12:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 307386152
- current block number: 307386152

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xb99aec1b27b1ac91d3871cbcc6810ff5198baca5

# Diff at Tue, 18 Feb 2025 15:31:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 307386152

## Description

Game7 full discovery.

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
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944)
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
