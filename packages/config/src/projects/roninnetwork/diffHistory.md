Generated with discovered.json: 0xd9f0aa1ce740fd1679d111051e6007f9bba82972

# Diff at Tue, 01 Sep 2026 11:54:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@971c51541a4e32a7dcee1adc458d42516d2950ec block: 1787834376
- current timestamp: 1787834376

## Description

ossification onboarding: flag the critical perimeter (Kailua game/treasury/verifier, shared RISC Zero router + timelock + active estops/verifiers, both ProxyAdmins), SuperchainConfig-fork guardian HIGH, ASR air gap HIGH, timelock CallScheduled/CallExecuted watch; legacy MainchainGateway/BridgeManager stay outside the perimeter (external TVS) with MEDIUM-watched state. Also includes the earlier cohort-wide severity fixes vs main (DGF gameArgs HIGH etc.).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787834376 (main branch discovery), not current.

```diff
    contract TimelockController (eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711) [global/TimelockController] {
    +++ description: A timelock with access control. The current minimum delay is 3d.
+++ description: since the RiscZeroVerifierRouter does not emit events on verifier changes, we watch the single upstream permissioned address.
+++ severity: HIGH
      values.callsExecuted:
+        [{"id":"0x7a84c572dc62f88115a1ee5163b983a332e1214113fb2d000d9d1bcaef2e9c10","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30310fe5980000000000000000000000000000000000000000000000000000000000000000000000000000000044c220f0598345195ce99ad6a57adffcb9ea33e7"},{"id":"0xadb3b737a6a6bdcb4c8dccde80cd44ac4e4d3db3a89374a7b4acdd4b64f72dda","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x64d623530000000000000000000000000000000000000000000000000000000000093a80"},{"id":"0x3f19aefd1b1ceef8c24d069d4199d2fa93837840c710fe02fa8caa57257b29f1","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af3050bd17690000000000000000000000000000000000000000000000000000000000000000000000000000000008aed6c108e500540a9544bef7a8b8a05e056e87"},{"id":"0x8c69e0a7787b08054748643b2f24e534391080bd0c61e3a0267ce6b152664d0d","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30c101b42b0000000000000000000000000000000000000000000000000000000000000000000000000000000003b66cedab014ca7e970bfb83c1951d10dd2a805"},{"id":"0x960674420bb13639f49c3e4680c859d460652b079912a2e19d48070e1839717e","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af309f39696c0000000000000000000000000000000000000000000000000000000000000000000000000000000068dc2cb4e61774873971c499d9b239ec5ac540e3"},{"id":"0x3d85619c066effeda2dfdaa6533cf4ab13dc517fa095d3ff1ed03ba753e04d43","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30f536085a00000000000000000000000000000000000000000000000000000000000000000000000000000000da8f3de6fbbdb261ac771b813a578a7abda6b2b1"},{"id":"0xd0791ae7ead2e43dd04e036894376e9f800038dcd77ca25aee9c25b10c2152c7","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x64d62353000000000000000000000000000000000000000000000000000000000003f480"},{"id":"0xfb7623c10d952a912314a537418c1ea4f95ceeee7628d8564f7e1c814d09da5b","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30bb001d44000000000000000000000000000000000000000000000000000000000000000000000000000000001efdd13f831ceeea14940806705a53d3211cd698"},{"id":"0x8f9bc667a318296f0c9a7a2773fd371cfedc904128c7ff5af6c246d383cb46db","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af3073c457ba000000000000000000000000000000000000000000000000000000000000000000000000000000009f9994eb4cb5200198fefb470f8b50301662e696"},{"id":"0xaee8ce52716542c6fedc0f10553f1b763702d9bef05dcdcdf8c5cb2ed8d6cabb","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30242f9d5b00000000000000000000000000000000000000000000000000000000000000000000000000000000844d5f01161e3559d36f23d0aa9e9620949af782"},{"id":"0xcb59c64b787c143323784e652a53a3df139307efbcefa80b438a461680142a2b","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0x93d237f650bd176900000000000000000000000000000000000000000000000000000000"},{"id":"0x02c881bb278f937c1b8b577c6a44e474f471442762ddaf1e416b5ae793acf8cc","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0x93d237f6c101b42b00000000000000000000000000000000000000000000000000000000"},{"id":"0x5fb8d6ab7b9ad6614a645faf85120306acf72c02bc66de00b027c8ec57eff377","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x2f2ff15db09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc10000000000000000000000002e5bcc9959db5f5016f830e47943b07242cb2609"},{"id":"0x336fa76c82918a2642423bcae028021a204288e86965316b58737fb6e6a2d985","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x2f2ff15dd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e630000000000000000000000002e5bcc9959db5f5016f830e47943b07242cb2609"},{"id":"0x0c0f9e544f5acb8eafdf44bbd4a1f21cde030970ad1f76c01504ff1c291f0e9d","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x2f2ff15dfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f7830000000000000000000000002e5bcc9959db5f5016f830e47943b07242cb2609"},{"id":"0x89a458a6781bd045d785361e429a3df71167dff9e14996fa5f98ca7c5eb9d4c3","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0xd547741fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1000000000000000000000000f616a4f81857cfee54a4a049ec187172574bd412"},{"id":"0x4acc61e26f03e0270258c3fe8aec76d8ce5c80e8e100972e3091fc77c8882819","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0xd547741fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63000000000000000000000000f616a4f81857cfee54a4a049ec187172574bd412"},{"id":"0xf239631e46b22677b2b8b3b35d3780a1de298d9234c6906ce98aa3168d52cc97","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0xd547741ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783000000000000000000000000f616a4f81857cfee54a4a049ec187172574bd412"}]
+++ description: since the RiscZeroVerifierRouter does not emit events on verifier changes, we watch the single upstream permissioned address.
      values.callsScheduled:
+        [{"id":"0x7a84c572dc62f88115a1ee5163b983a332e1214113fb2d000d9d1bcaef2e9c10","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30310fe5980000000000000000000000000000000000000000000000000000000000000000000000000000000044c220f0598345195ce99ad6a57adffcb9ea33e7","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":1},{"id":"0xadb3b737a6a6bdcb4c8dccde80cd44ac4e4d3db3a89374a7b4acdd4b64f72dda","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x64d623530000000000000000000000000000000000000000000000000000000000093a80","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":1},{"id":"0xca7c32c7743c15b77a35c4f9067ba7b6a70ba735d9223900eda94ce2c9b30b84","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af304c630d8700000000000000000000000000000000000000000000000000000000000000000000000000000000b839ea7bba8e6bb2893ca5252f3f3c13323d74f7","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0x3f19aefd1b1ceef8c24d069d4199d2fa93837840c710fe02fa8caa57257b29f1","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af3050bd17690000000000000000000000000000000000000000000000000000000000000000000000000000000008aed6c108e500540a9544bef7a8b8a05e056e87","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0x8c69e0a7787b08054748643b2f24e534391080bd0c61e3a0267ce6b152664d0d","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30c101b42b0000000000000000000000000000000000000000000000000000000000000000000000000000000003b66cedab014ca7e970bfb83c1951d10dd2a805","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0x7bd40c500f2b3900d572471750afc6fb8ff842feac61ce3b28457400df977bdd","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30922fe23d000000000000000000000000000000000000000000000000000000000000000000000000000000001e785018a65d9a9c8ee52955da0dd9644353a22f","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0xffe2b1acdec15653f2ec46c307b748d6ada029fe63e7308d24b980d503ab7ea3","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af3014da014b00000000000000000000000000000000000000000000000000000000000000000000000000000000268436d69f9434018657b278d838546e7dbc2d7f","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0x960674420bb13639f49c3e4680c859d460652b079912a2e19d48070e1839717e","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af309f39696c0000000000000000000000000000000000000000000000000000000000000000000000000000000068dc2cb4e61774873971c499d9b239ec5ac540e3","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0x3d85619c066effeda2dfdaa6533cf4ab13dc517fa095d3ff1ed03ba753e04d43","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30f536085a00000000000000000000000000000000000000000000000000000000000000000000000000000000da8f3de6fbbdb261ac771b813a578a7abda6b2b1","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0xd0791ae7ead2e43dd04e036894376e9f800038dcd77ca25aee9c25b10c2152c7","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x64d62353000000000000000000000000000000000000000000000000000000000003f480","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":604800},{"id":"0xfb7623c10d952a912314a537418c1ea4f95ceeee7628d8564f7e1c814d09da5b","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30bb001d44000000000000000000000000000000000000000000000000000000000000000000000000000000001efdd13f831ceeea14940806705a53d3211cd698","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x8f9bc667a318296f0c9a7a2773fd371cfedc904128c7ff5af6c246d383cb46db","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af3073c457ba000000000000000000000000000000000000000000000000000000000000000000000000000000009f9994eb4cb5200198fefb470f8b50301662e696","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0xaee8ce52716542c6fedc0f10553f1b763702d9bef05dcdcdf8c5cb2ed8d6cabb","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0xd0a6af30242f9d5b00000000000000000000000000000000000000000000000000000000000000000000000000000000844d5f01161e3559d36f23d0aa9e9620949af782","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0xcb59c64b787c143323784e652a53a3df139307efbcefa80b438a461680142a2b","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0x93d237f650bd176900000000000000000000000000000000000000000000000000000000","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x02c881bb278f937c1b8b577c6a44e474f471442762ddaf1e416b5ae793acf8cc","index":0,"target":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","value":0,"data":"0x93d237f6c101b42b00000000000000000000000000000000000000000000000000000000","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x5fb8d6ab7b9ad6614a645faf85120306acf72c02bc66de00b027c8ec57eff377","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x2f2ff15db09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc10000000000000000000000002e5bcc9959db5f5016f830e47943b07242cb2609","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x336fa76c82918a2642423bcae028021a204288e86965316b58737fb6e6a2d985","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x2f2ff15dd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e630000000000000000000000002e5bcc9959db5f5016f830e47943b07242cb2609","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0c0f9e544f5acb8eafdf44bbd4a1f21cde030970ad1f76c01504ff1c291f0e9d","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0x2f2ff15dfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f7830000000000000000000000002e5bcc9959db5f5016f830e47943b07242cb2609","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x89a458a6781bd045d785361e429a3df71167dff9e14996fa5f98ca7c5eb9d4c3","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0xd547741fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1000000000000000000000000f616a4f81857cfee54a4a049ec187172574bd412","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x4acc61e26f03e0270258c3fe8aec76d8ce5c80e8e100972e3091fc77c8882819","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0xd547741fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63000000000000000000000000f616a4f81857cfee54a4a049ec187172574bd412","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0xf239631e46b22677b2b8b3b35d3780a1de298d9234c6906ce98aa3168d52cc97","index":0,"target":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","value":0,"data":"0xd547741ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783000000000000000000000000f616a4f81857cfee54a4a049ec187172574bd412","predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":259200}]
      critical:
+        true
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","description":"manage all access control roles.","role":".defaultAdminAC"},{"permission":"interact","from":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","description":"add/remove verifiers and the selectors they are mapped to.","role":".owner"}]
      fieldMeta:
+        {"getMinDelay":{"severity":"HIGH"},"accessControl":{"severity":"HIGH"},"callsScheduled":{"description":"since the RiscZeroVerifierRouter does not emit events on verifier changes, we watch the single upstream permissioned address."},"callsExecuted":{"severity":"HIGH","description":"since the RiscZeroVerifierRouter does not emit events on verifier changes, we watch the single upstream permissioned address."}}
    }
```

```diff
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      fieldMeta.disputeGameFinalityDelaySeconds:
+        {"severity":"HIGH","description":"Delay between a dispute game resolving and its root claim becoming usable to finalize withdrawals (the air gap)."}
      critical:
+        true
    }
```

```diff
    contract RiscZeroVerifierEmergencyStop (eth:0x1efDd13f831ceeEa14940806705A53D3211CD698) [risc0/RiscZeroVerifierEmergencyStop] {
    +++ description: A verifier wrapper for the eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9 that allows pausing (emergency stop) the verifier by its owner.
      fieldMeta.owner:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle] {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      critical:
+        true
    }
```

```diff
    contract KailuaGame (eth:0x296e7aD6D441b0627768bC0650179a4206479444) [risc0/KailuaGame] {
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
      critical:
+        true
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 3.0.0).
      critical:
+        true
    }
```

```diff
    contract MainchainBridgeManager (eth:0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) [N/A] {
    +++ description: Governance and proxy-admin contract for the legacy MainchainGateway bridge. Holds the operator/governor set, tallies stake-weighted votes for bridge proposals (operator rotations, threshold changes, withdrawals).
      receivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08","role":"admin"}]
      fieldMeta:
+        {"$admin":{"severity":"MEDIUM"},"getThreshold":{"severity":"MEDIUM"},"getBridgeOperators":{"severity":"MEDIUM"}}
    }
```

```diff
    contract Safe (eth:0x2E5bcc9959dB5F5016F830E47943b07242CB2609) [GnosisSafe] {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","description":"cancel queued transactions.","role":".Canceller"},{"permission":"interact","from":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","description":"execute transactions that are ready.","role":".Executor"},{"permission":"interact","from":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","description":"manage all access control roles.","role":".defaultAdminAC","via":[{"address":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","delay":259200}]},{"permission":"interact","from":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","description":"propose transactions.","role":".Proposer"},{"permission":"interact","from":"eth:0x1efDd13f831ceeEa14940806705A53D3211CD698","description":"pause the verifier.","role":".owner"},{"permission":"interact","from":"eth:0x68dC2cB4e61774873971c499D9b239ec5Ac540E3","description":"pause the verifier.","role":".owner"},{"permission":"interact","from":"eth:0x844D5f01161E3559d36f23d0Aa9E9620949aF782","description":"pause the verifier.","role":".owner"},{"permission":"interact","from":"eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319","description":"add/remove verifiers and the selectors they are mapped to.","role":".owner","via":[{"address":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","delay":259200}]},{"permission":"interact","from":"eth:0x9F9994Eb4Cb5200198FEfb470f8b50301662e696","description":"pause the verifier.","role":".owner"},{"permission":"interact","from":"eth:0xDa8f3de6fBBdb261Ac771B813a578A7aBdA6B2b1","description":"pause the verifier.","role":".owner"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","delay":259200,"role":".Executor"}]
    }
```

```diff
    contract RiscZeroVerifierEmergencyStop (eth:0x44c220f0598345195cE99AD6A57aDfFcb9Ea33e7) [risc0/RiscZeroVerifierEmergencyStop] {
    +++ description: A verifier wrapper for the eth:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C that allows pausing (emergency stop) the verifier by its owner.
      fieldMeta.owner:
+        {"severity":"HIGH"}
    }
```

```diff
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta.owner:
+        {"severity":"HIGH"}
      fieldMeta.wethFromDGF:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract RiscZeroSetVerifier (eth:0x5005aBa3DFf7C940fcc1e48DccCAD611a80eEB85) [risc0/RiscZeroSetVerifier] {
    +++ description: Set verifier contract for RISC Zero proofs (version 0.9.0). It allows verifying a whole set of proofs identified with a Merkle root at once, afterwards each individual proof could be efficiently verified just by checking Merkle inclusion against the verified root.
      critical:
+        true
    }
```

```diff
    contract ProxyAdmin (eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34) [global/ProxyAdmin] {
    +++ description: None
      critical:
+        true
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","role":"admin"}]
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract LegacyBridgeOwner (eth:0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) [GnosisSafe] {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB","role":"admin"}]
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x58bf355C5d4EdFc723eF89d99582ECCfd143266A) [opstack/PermissionedDisputeGame] {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      fieldMeta.absolutePrestateDecoded.description:
-        "Prestate tag for known prestates."
+        "Prestate tag for known prestates. On clones-with-immutable-args implementations this reads 0 from the bare impl; the authoritative prestate lives in the DisputeGameFactory gameArgs (HIGH-watched there)."
      critical:
+        true
    }
```

```diff
    contract MainchainGateway (eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) [N/A] {
    +++ description: Legacy multi-sig-secured Ronin bridge contract holding the L1 side of deposits made before the April 2025 Chainlink CCIP migration. Still custodies residual user balances (ETH backing legacy WETH on Ronin, the deprecated WBTC contract, and dust). Withdrawals authorised by the Ronin BridgeOperator stake-weighted threshold via MainchainBridgeManager.
      fieldMeta:
+        {"$admin":{"severity":"MEDIUM"},"paused":{"severity":"MEDIUM"},"getThreshold":{"severity":"MEDIUM"},"getHighTierVoteWeightThreshold":{"severity":"MEDIUM"}}
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS] {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      critical:
+        true
    }
```

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      fieldMeta.paused.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract RiscZeroVerifierEmergencyStop (eth:0x68dC2cB4e61774873971c499D9b239ec5Ac540E3) [risc0/RiscZeroVerifierEmergencyStop] {
    +++ description: A verifier wrapper for the eth:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97 that allows pausing (emergency stop) the verifier by its owner.
      fieldMeta.owner:
+        {"severity":"HIGH"}
    }
```

```diff
    contract DelayedWETH (eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      critical:
+        true
      fieldMeta:
+        {"$admin":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract KailuaVerifier (eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C) [N/A] {
    +++ description: Proxy in front of the Kailua proof verifier; routes verification requests to the canonical RiscZeroVerifierRouter and asserts the chain-specific rollup config and FPVM image ID.
      critical:
+        true
    }
```

```diff
    contract AddressManager (eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C) [opstack/AddressManager] {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      critical:
+        true
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC) [global/ProxyAdmin] {
    +++ description: None
      critical:
+        true
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C","description":"set and change address mappings.","role":".owner"},{"permission":"upgrade","from":"eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A","role":"admin"},{"permission":"upgrade","from":"eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959","role":"admin"},{"permission":"upgrade","from":"eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a","role":"admin"},{"permission":"upgrade","from":"eth:0x51639D151456d0384285C6974e441A5D2B784B7D","role":"admin"},{"permission":"upgrade","from":"eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77","role":"admin"},{"permission":"upgrade","from":"eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434","role":"admin"},{"permission":"upgrade","from":"eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin"},{"permission":"upgrade","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","role":"admin"},{"permission":"upgrade","from":"eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e","role":"admin"}]
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract RiscZeroVerifierEmergencyStop (eth:0x844D5f01161E3559d36f23d0Aa9E9620949aF782) [risc0/RiscZeroVerifierEmergencyStop] {
    +++ description: A verifier wrapper for the eth:0x5005aBa3DFf7C940fcc1e48DccCAD611a80eEB85 that allows pausing (emergency stop) the verifier by its owner.
      fieldMeta.owner:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract L1StandardBridge (eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      critical:
+        true
      fieldMeta:
+        {"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract RiscZeroVerifierRouter (eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319) [risc0/RiscZeroVerifierRouter] {
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711).
      fieldMeta.owner:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    EOA  (eth:0x9aA8feACbB42659a806cDD6933ab3982586824F1) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","description":"Allowed to commit transactions from the current layer to the host chain.","role":".batcherHash"}]
    }
```

```diff
    contract RiscZeroVerifierEmergencyStop (eth:0x9F9994Eb4Cb5200198FEfb470f8b50301662e696) [risc0/RiscZeroVerifierEmergencyStop] {
    +++ description: A verifier wrapper for the eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D that allows pausing (emergency stop) the verifier by its owner.
      fieldMeta.owner:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.2.0).
      critical:
+        true
    }
```

```diff
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      fieldMeta.batcherHash:
+        {"severity":"LOW"}
      fieldMeta.owner:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract KailuaTreasury (eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336) [risc0/KailuaTreasury] {
    +++ description: Kailua (RISC Zero ZK fault-proof) treasury: holds participation bonds, mints KailuaGame clones, and defines the vanguard proposer economics. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned.
      critical:
+        true
    }
```

```diff
    EOA  (eth:0xD379de941E78Ab394d4D4917FcCE1CC45b6cd620) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336","description":"propose new state roots before anyone else, giving a first-mover advantage on the optimistic clock.","role":".vanguard"}]
    }
```

```diff
    contract RiscZeroVerifierEmergencyStop (eth:0xDa8f3de6fBBdb261Ac771B813a578A7aBdA6B2b1) [risc0/RiscZeroVerifierEmergencyStop] {
    +++ description: A verifier wrapper for the eth:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF that allows pausing (emergency stop) the verifier by its owner.
      fieldMeta.owner:
+        {"severity":"HIGH"}
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"interact","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"},{"permission":"interact","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","description":"Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).","role":".guardian"},{"permission":"upgrade","from":"eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0x51639D151456d0384285C6974e441A5D2B784B7D","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C","role":"admin"},{"permission":"upgrade","from":"eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]},{"permission":"upgrade","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","role":"admin","via":[{"address":"eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34"}]},{"permission":"upgrade","from":"eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34","role":".owner"},{"permission":"act","from":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC","role":".owner"}]
    }
```

```diff
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      fieldMeta.paused.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.guardian:
+        {"severity":"HIGH","description":"Address that can pause Ronin withdrawals and blacklist dispute games."}
      critical:
+        true
    }
```

```diff
    EOA  (eth:0xF616A4f81857CFEe54A4A049Ec187172574bd412) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x44c220f0598345195cE99AD6A57aDfFcb9Ea33e7","description":"pause the verifier.","role":".owner"}]
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      critical:
+        true
      fieldMeta:
+        {"$admin":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x1159ee32cabc6f5511c8538e485a447f6689ed4a

# Diff at Thu, 27 Aug 2026 12:41:08 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@07685e2b690dd5d880203f3696ff2e1bc300a13d block: 1783604846
- current timestamp: 1787834376

## Description

Conduit Multisig 1: member added; threshold 4/10 → 4/11.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x9402c42dB162d5a0927c032136f40Cc9C71853F2"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0xe502f9aec749baf5cf7f80bdf76b5b379a11e72c

# Diff at Thu, 09 Jul 2026 13:48:35 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1e8c379b8fe786381adcddb9c648173990ad4ea3 block: 1783327943
- current timestamp: 1783604846

## Description

Drop the Ronin-local permission overrides on the DGF's `proposerFromDGF` and `challengerFromDGF` fields. Now that `respectedGameType` is 1337 (KailuaGame), these are the legacy proposer/challenger for the PermissionedDisputeGame (game type 1) — dormant unless the Guardian rolls back.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1783327943 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a","description":"Allowed to challenge or delete state roots proposed by a Proposer.","role":".challengerFromDGF"}]
    }
```

```diff
    EOA  (eth:0xD379de941E78Ab394d4D4917FcCE1CC45b6cd620) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a","description":"Allowed to post new state roots of the current layer to the host chain.","role":".proposerFromDGF"}
    }
```

Generated with discovered.json: 0x3e6247f7c354f1b9671aaa3adfcf3fd24e665a9e

# Diff at Mon, 06 Jul 2026 08:53:30 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@4572e5b954c85d78517dc66fc4a82b8ddc679e2a block: 1781531783
- current timestamp: 1783327943

## Description

Kailua cutover: `respectedGameType` on OptimismPortal2 and AnchorStateRegistry moved from 1 (PermissionedDisputeGame) to 1337 (KailuaGame). Withdrawals now clear through the ZK fault-proof game.

DisputeGameFactory `game1337` slot repointed from KailuaTreasury (`eth:0xc7EaCDd1…`) to the KailuaGame implementation (`eth:0x296e7aD6…`); the treasury continues to hold bonds and mint game clones.

KailuaVerifier proxy upgraded (impl `eth:0x7fC721AC…` → `eth:0xDd26da83…`, 2026-07-01), with new `FPVM_IMAGE_ID` (`0xd3c097df…`) and `ROLLUP_CONFIG_HASH` (`0x96ff8605…`).

KailuaTreasury economic parameters now live: `participationBond` = 0.5 ETH, `vanguard` = `eth:0xD379de94…`, `vanguardAdvantage` = 1 month.

## Watched changes

```diff
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      description:
-        "Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
+        "Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the KailuaGame."
      values.RespectedGameString:
-        "PermissionedDisputeGame"
+        "KailuaGame"
+++ severity: HIGH
      values.respectedGameType:
-        1
+        1337
    }
```

```diff
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game1337:
-        "eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336"
+        "eth:0x296e7aD6D441b0627768bC0650179a4206479444"
    }
```

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame."
      values.RespectedGameString:
-        "PermissionedDisputeGame"
+        "KailuaGame"
+++ severity: HIGH
      values.respectedGameType:
-        1
+        1337
    }
```

```diff
    contract KailuaVerifier (eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C) [N/A] {
    +++ description: Proxy in front of the Kailua proof verifier; routes verification requests to the canonical RiscZeroVerifierRouter and asserts the chain-specific rollup config and FPVM image ID.
      values.$implementation:
-        "eth:0x7fC721ACC2183c292737C5a28Ea1B30d19f1cF29"
+        "eth:0xDd26da83B27987A7040caE31f2E35d9Bd6f5DE59"
      values.$pastUpgrades.1:
+        ["2026-07-01T10:19:35.000Z","0x07bf7a192a2ea3b5324ef5cef339715fc6b972b261463e751f39a3f7bb2ae72d",["eth:0xDd26da83B27987A7040caE31f2E35d9Bd6f5DE59"]]
      values.$upgradeCount:
-        1
+        2
      values.FPVM_IMAGE_ID:
-        "0xc2e7bc71ae10caf806a1a073e4170daf3f4ac31099f1f854f7062dd70ed12fe3"
+        "0xd3c097dfec583bb305eefcb5dcddc313b072e372cee66e13492c37fb50e6a90b"
      values.ROLLUP_CONFIG_HASH:
-        "0xc1f5bee1ef35d2b73a7cd351e650b2b123cb3bec91b0de3941af90539d5fc829"
+        "0x96ff86054c51b6b832108a14d93ced530c42e0ee5a113b47671c912fc19f5b1a"
      implementationNames.eth:0x7fC721ACC2183c292737C5a28Ea1B30d19f1cF29:
-        "KailuaVerifier"
      implementationNames.eth:0xDd26da83B27987A7040caE31f2E35d9Bd6f5DE59:
+        "KailuaVerifier"
    }
```

```diff
    contract KailuaTreasury (eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336) [risc0/KailuaTreasury] {
    +++ description: Kailua (RISC Zero ZK fault-proof) treasury: holds participation bonds, mints KailuaGame clones, and defines the vanguard proposer economics. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned.
      values.participationBond:
-        0
+        "500000000000000000"
      values.participationBondFmt:
-        "0"
+        "0.5"
      values.vanguard:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xD379de941E78Ab394d4D4917FcCE1CC45b6cd620"
      values.vanguardAdvantage:
-        0
+        2592000
      values.vanguardAdvantageFmt:
-        "0s"
+        "1mo"
    }
```

```diff
    EOA  (eth:0xD379de941E78Ab394d4D4917FcCE1CC45b6cd620) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336","description":"propose new state roots before anyone else, giving a first-mover advantage on the optimistic clock.","role":".vanguard"}
    }
```

```diff
+   Status: CREATED
    contract KailuaGame (eth:0x296e7aD6D441b0627768bC0650179a4206479444) [risc0/KailuaGame]
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
```

## Source code changes

```diff
.../src/projects/roninnetwork/.flat/KailuaGame.sol | 3874 ++++++++++++++++++++
 1 file changed, 3874 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781531783 (main branch discovery), not current.

```diff
    contract KailuaTreasury (eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336) [risc0/KailuaTreasury] {
    +++ description: Kailua (RISC Zero ZK fault-proof) treasury: holds participation bonds, mints KailuaGame clones, and defines the vanguard proposer economics. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned.
      description:
-        "Kailua (RISC Zero ZK fault-proof) game implementation registered as game type 1337 in the DisputeGameFactory. Deployed but NOT yet active. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned."
+        "Kailua (RISC Zero ZK fault-proof) treasury: holds participation bonds, mints KailuaGame clones, and defines the vanguard proposer economics. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned."
    }
```

Generated with discovered.json: 0x81fe96904ec3c6d1b6424554954cfd9180db1366

# Diff at Wed, 01 Jul 2026 10:34:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfafbf3de953d9f519656c89c622fe51a04d547a block: 1781531783
- current timestamp: 1781531783

## Description

Config: small template adjustments

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781531783 (main branch discovery), not current.

```diff
    contract RiscZeroGroth16Verifier (eth:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 3.0.0).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.3).
      template:
+        "taiko/RiscZeroGroth16Verifier"
      description:
+        "Verifier contract for RISC Zero Groth16 proofs (version 2.0.3)."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.2.0).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C) [taiko/RiscZeroGroth16VerifierLegacy] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs. This older implementation exposes control-root and selector constants but does not expose a VERSION getter.
      template:
+        "taiko/RiscZeroGroth16VerifierLegacy"
      description:
+        "Verifier contract for RISC Zero Groth16 proofs. This older implementation exposes control-root and selector constants but does not expose a VERSION getter."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xafb7c6886c1a9bbeb037037fcc658dad77898d52

# Diff at Tue, 30 Jun 2026 20:24:43 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d6a4cf0104ece715f88d9597c7e158a2841e88fd block: 1781531783
- current timestamp: 1781531783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781531783 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.8:
+        "FaultDisputeGame"
    }
```

Generated with discovered.json: 0x02f0fa465869e5e623c2d58227a8c68b9eb52aa0

# Diff at Mon, 15 Jun 2026 13:58:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@254df558db0f4fcb5b0e269facd77fad1c7d2ddb block: 1780557929
- current timestamp: 1781531783

## Description

Guardian role on OptimismPortal2, SystemConfig and SuperchainConfig moved from Conduit Multisig 1 to the joint Ronin/Conduit Safe (RoninConduitOwner): SuperchainConfig was re-initialized via the standard StorageSetter→same-impl pattern, bumping `initVersion` 1 → 2 and setting the new guardian address. Conduit Multisig 1 remains challenger in DGF.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.4:
-        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.8:
-        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 10 (40%)"
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","description":"Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).","role":".guardian"}
    }
```

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.guardian:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.guardian:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","description":"Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).","role":".guardian"}
    }
```

```diff
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      values.$pastUpgrades.1:
+        ["2026-06-09T07:02:35.000Z","0x7e9202c4d6cb60aa8f0d86f9524f58cc3b5edb505495f61503d9374e3859cdb6",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2026-06-09T07:02:35.000Z","0x7e9202c4d6cb60aa8f0d86f9524f58cc3b5edb505495f61503d9374e3859cdb6",["eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

Generated with discovered.json: 0x8ad704aa9cad63433de68fbaa561468f7c9c8ff0

# Diff at Tue, 09 Jun 2026 12:43:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780557929
- current timestamp: 1780557929

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780557929 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to challenge or delete state roots proposed by a Proposer."
      receivedPermissions.0.permission:
-        "challenge"
+        "interact"
      receivedPermissions.1.description:
+        "Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless)."
      receivedPermissions.1.permission:
-        "guard"
+        "interact"
    }
```

```diff
    EOA  (eth:0x9aA8feACbB42659a806cDD6933ab3982586824F1) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (eth:0xD379de941E78Ab394d4D4917FcCE1CC45b6cd620) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to post new state roots of the current layer to the host chain."
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
    }
```

Generated with discovered.json: 0x42dab6958b58d31079004d1f0f6333426235069a

# Diff at Thu, 04 Jun 2026 20:29:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1779399734
- current timestamp: 1780557929

## Description

Kailua (RISC Zero ZK fault-proof) deployed but not yet active.
DisputeGameFactory registered game type 1337 → KailuaTreasury (`eth:0xc7EaCDd1…`).
OptimismPortal2 and AnchorStateRegistry still have respectedGameType = 1 (PermissionedDisputeGame); cutover requires a separate change.

Ronin KailuaTreasury (v1.2.0, `eth:0xc7EaCDd1…`): verifier extracted to a separate `KAILUA_VERIFIER` proxy, bond accounting reworked. Diff vs BOB v0.1.0 baseline: https://disco.l2beat.com/diff/eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336/eth:0x9B3E1661bccAF907893B71e4016c01513ae9263C.

RoninConduitOwner got admin over the KailuaVerifier proxy (`eth:0x6b49976a…`), so the verifier proxy is upgradable along the same path as the other OP Stack contracts.

RiscZeroVerifierRouter (`eth:0x8EaB2D97…`) is the shared RISC Zero verifier-selector router. Owner is a TimelockController (`eth:0x0b144E07…`, 3d delay) governed by Safe `eth:0x2E5bcc…`. Both are shared RISC Zero infrastructure, not Ronin-specific.

## Watched changes

```diff
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game1337:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xcdC931935768c0562AfE989A366a3Dc4d52F4853"
      values.$members.8:
-        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 3d.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x1efDd13f831ceeEa14940806705A53D3211CD698) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9 that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97) [taiko/RiscZeroGroth16Verifier]
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D) [taiko/RiscZeroGroth16Verifier]
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 3.0.0).
```

```diff
+   Status: CREATED
    contract Safe (eth:0x2E5bcc9959dB5F5016F830E47943b07242CB2609) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x44c220f0598345195cE99AD6A57aDfFcb9Ea33e7) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroSetVerifier (eth:0x5005aBa3DFf7C940fcc1e48DccCAD611a80eEB85) [risc0/RiscZeroSetVerifier]
    +++ description: Set verifier contract for RISC Zero proofs (version 0.9.0). It allows verifying a whole set of proofs identified with a Merkle root at once, afterwards each individual proof could be efficiently verified just by checking Merkle inclusion against the verified root.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x68dC2cB4e61774873971c499D9b239ec5Ac540E3) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97 that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract KailuaVerifier (eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C) [N/A]
    +++ description: Proxy in front of the Kailua proof verifier; routes verification requests to the canonical RiscZeroVerifierRouter and asserts the chain-specific rollup config and FPVM image ID.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x844D5f01161E3559d36f23d0Aa9E9620949aF782) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x5005aBa3DFf7C940fcc1e48DccCAD611a80eEB85 that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319) [risc0/RiscZeroVerifierRouter]
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711).
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x9F9994Eb4Cb5200198FEfb470f8b50301662e696) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9) [taiko/RiscZeroGroth16Verifier]
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.2.0).
```

```diff
+   Status: CREATED
    contract KailuaTreasury (eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336) [risc0/KailuaTreasury]
    +++ description: Kailua (RISC Zero ZK fault-proof) game implementation registered as game type 1337 in the DisputeGameFactory. Deployed but NOT yet active. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0xDa8f3de6fBBdb261Ac771B813a578A7aBdA6B2b1) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C) [N/A]
    +++ description: None
```

## Source code changes

```diff
.../projects/roninnetwork/.flat/KailuaTreasury.sol | 3617 ++++++++++++++++++++
 .../.flat/KailuaVerifier/KailuaVerifier.sol        |  509 +++
 .../roninnetwork/.flat/KailuaVerifier/Proxy.p.sol  |  120 +
 ...:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97.sol | 1767 ++++++++++
 ...:0x2a098988600d87650Fb061FfAff08B97149Fa84D.sol | 1780 ++++++++++
 ...:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF.sol | 1779 ++++++++++
 ...:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9.sol | 1780 ++++++++++
 ...:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C.sol | 1760 ++++++++++
 .../roninnetwork/.flat/RiscZeroSetVerifier.sol     |  900 +++++
 ...:0x1efDd13f831ceeEa14940806705A53D3211CD698.sol |  366 ++
 ...:0x44c220f0598345195cE99AD6A57aDfFcb9Ea33e7.sol |  366 ++
 ...:0x68dC2cB4e61774873971c499D9b239ec5Ac540E3.sol |  366 ++
 ...:0x844D5f01161E3559d36f23d0Aa9E9620949aF782.sol |  366 ++
 ...:0x9F9994Eb4Cb5200198FEfb470f8b50301662e696.sol |  366 ++
 ...:0xDa8f3de6fBBdb261Ac771B813a578A7aBdA6B2b1.sol |  366 ++
 .../roninnetwork/.flat/RiscZeroVerifierRouter.sol  |  282 ++
 .../src/projects/roninnetwork/.flat/Safe/Safe.sol  | 1216 +++++++
 .../roninnetwork/.flat/Safe/SafeProxy.p.sol        |   42 +
 .../roninnetwork/.flat/TimelockController.sol      | 1111 ++++++
 19 files changed, 18859 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779399734 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.621:
+        "AggregateVerifier"
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      name:
-        "Safe"
+        "RoninConduitOwner"
      description:
+        "5-of-6 joint Ronin/Conduit Safe."
    }
```

Generated with discovered.json: 0xb249eb2d3cd58c2b0e7671ced0b0d72c1f5a5a21

# Diff at Thu, 21 May 2026 21:43:21 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@af480cdcac217110f9e99ef400ba0185c35a6c55 block: 1779204482
- current timestamp: 1779399734

## Description

ProxyAdminOwner / `owner` rotated from Conduit Multisig 1 to a new 5-of-6 Safe (`eth:0xE9Ad9723…`) that is a joint Ronin/Conduit multisig (per Ronin team: 4 Ronin signers + 2 Conduit signers retained from Conduit Multisig 1). Affects AnchorStateRegistry, L1ERC721Bridge, DisputeGameFactory (owner + proxyAdminOwner), and the other Ronin contracts under that ProxyAdmin.

## Watched changes

```diff
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x51639D151456d0384285C6974e441A5D2B784B7D","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","role":"admin","via":[{"address":"eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34","role":".owner"},{"permission":"act","from":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34) [global/ProxyAdmin] {
    +++ description: None
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract DelayedWETH (eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract ProxyAdmin (eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC) [global/ProxyAdmin] {
    +++ description: None
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract L1StandardBridge (eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS]
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe]
    +++ description: None
```

## Source code changes

```diff
.../src/projects/roninnetwork/.flat/MIPS.sol       | 3274 ++++++++++++++++++++
 .../projects/roninnetwork/.flat/PreimageOracle.sol | 1463 +++++++++
 .../src/projects/roninnetwork/.flat/Safe/Safe.sol  | 1216 ++++++++
 .../roninnetwork/.flat/Safe/SafeProxy.p.sol        |   42 +
 4 files changed, 5995 insertions(+)
```

Generated with discovered.json: 0xea0a603c0f304f12e8c7a1b9e5047758ae7f946b

# Diff at Mon, 18 May 2026 09:19:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1779095885

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (eth:0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) [N/A]
    +++ description: Governance and proxy-admin contract for the legacy MainchainGateway bridge. Holds the operator/governor set, tallies stake-weighted votes for bridge proposals (operator rotations, threshold changes, withdrawals).
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x51639D151456d0384285C6974e441A5D2B784B7D) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract LegacyBridgeOwner (eth:0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x58bf355C5d4EdFc723eF89d99582ECCfd143266A) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MainchainGateway (eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) [N/A]
    +++ description: Legacy multi-sig-secured Ronin bridge contract holding the L1 side of deposits made before the April 2025 Chainlink CCIP migration. Still custodies residual user balances (ETH backing legacy WETH on Ronin, the deprecated WBTC contract, and dust). Withdrawals authorised by the Ronin BridgeOperator stake-weighted threshold via MainchainBridgeManager.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract PauseEnforcer (eth:0xF184a6Cd470Cac2CF5cD4fBa34e20D482D6A6062) [N/A]
    +++ description: Immutable emergency-pause contract for the legacy MainchainGateway. Holders of the SENTRY_ROLE can flip MainchainGateway into a paused state to halt deposits and withdrawals in an emergency.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
