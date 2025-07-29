Generated with discovered.json: 0xe279eb4b23099ccac54d252bcd95850c085eb134

# Diff at Mon, 14 Jul 2025 12:47:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 82973305
- current block number: 82973305

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82973305 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      values.$admin:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.$implementation.0:
-        "0xF7C1c37406626B305f5136364016425f487516a3"
+        "arb-nova:0xF7C1c37406626B305f5136364016425f487516a3"
      values.$implementation.1:
-        "0x5CAF2e861bB26aA0576583677488694FCf30e514"
+        "arb-nova:0x5CAF2e861bB26aA0576583677488694FCf30e514"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "arb-nova:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.0.2.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "arb-nova:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.1.2.0:
-        "0xF7C1c37406626B305f5136364016425f487516a3"
+        "arb-nova:0xF7C1c37406626B305f5136364016425f487516a3"
      values.$pastUpgrades.1.2.1:
-        "0x5CAF2e861bB26aA0576583677488694FCf30e514"
+        "arb-nova:0x5CAF2e861bB26aA0576583677488694FCf30e514"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.challengeManager:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb-nova:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      values.inbox:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb-nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb-nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      values.owner:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.rollupEventInbox:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb-nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xB246421622FB931BdAc20B4a26816F881771Db1e"
+        "arb-nova:0xB246421622FB931BdAc20B4a26816F881771Db1e"
      values.validatorUtils:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb-nova:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.validatorWalletCreator:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "arb-nova:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0:
-        ""
      implementationNames.0xF7C1c37406626B305f5136364016425f487516a3:
-        "RollupAdminLogic"
      implementationNames.0x5CAF2e861bB26aA0576583677488694FCf30e514:
-        "RollupUserLogic"
      implementationNames.arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0:
+        ""
      implementationNames.arb-nova:0xF7C1c37406626B305f5136364016425f487516a3:
+        "RollupAdminLogic"
      implementationNames.arb-nova:0x5CAF2e861bB26aA0576583677488694FCf30e514:
+        "RollupUserLogic"
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb-nova:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.0.2.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb-nova:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
+        "arb-nova:0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      values.executors.0:
-        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
+        "arb-nova:0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      implementationNames.0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9:
-        "TransparentUpgradeableProxy"
      implementationNames.0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
-        "UpgradeExecutor"
      implementationNames.arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
+        "UpgradeExecutor"
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb-nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
+        "arb-nova:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
      values.$pastUpgrades.0.2.0:
-        "0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
+        "arb-nova:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.rollup:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      implementationNames.0x0fF7A97caAb356c5507e5355b6819CB8b93d5591:
-        "TransparentUpgradeableProxy"
      implementationNames.0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb:
-        "ERC20RollupEventInbox"
      implementationNames.arb-nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb:
+        "ERC20RollupEventInbox"
    }
```

```diff
    EOA  (0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a) {
    +++ description: None
      address:
-        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
+        "arb-nova:0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
    }
```

```diff
    contract OneStepProver0 (0x19bD7120cD19D6BE6D21f987544e404e47608c16) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x19bD7120cD19D6BE6D21f987544e404e47608c16"
+        "arb-nova:0x19bD7120cD19D6BE6D21f987544e404e47608c16"
      implementationNames.0x19bD7120cD19D6BE6D21f987544e404e47608c16:
-        "OneStepProver0"
      implementationNames.arb-nova:0x19bD7120cD19D6BE6D21f987544e404e47608c16:
+        "OneStepProver0"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      implementationNames.0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91:
-        ""
      implementationNames.arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91:
+        ""
    }
```

```diff
    contract OneStepProverMath (0x2964CBfC551A76527D42F57131E7f77f9Dce8921) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x2964CBfC551A76527D42F57131E7f77f9Dce8921"
+        "arb-nova:0x2964CBfC551A76527D42F57131E7f77f9Dce8921"
      implementationNames.0x2964CBfC551A76527D42F57131E7f77f9Dce8921:
-        "OneStepProverMath"
      implementationNames.arb-nova:0x2964CBfC551A76527D42F57131E7f77f9Dce8921:
+        "OneStepProverMath"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb-nova:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d"
+        "arb-nova:0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d"
      values.$pastUpgrades.0.2.0:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "arb-nova:0x09824fe72BFF474d16D9c2774432E381BBD60662"
      values.$pastUpgrades.1.2.0:
-        "0xDCa690cB409FF3FBDC85F12179c4718Fa080Fb38"
+        "arb-nova:0xDCa690cB409FF3FBDC85F12179c4718Fa080Fb38"
      values.$pastUpgrades.2.2.0:
-        "0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d"
+        "arb-nova:0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.osp:
-        "0x944dB3fA4828B5F41ca0E77b97867529F1A899cB"
+        "arb-nova:0x944dB3fA4828B5F41ca0E77b97867529F1A899cB"
      values.resultReceiver:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      implementationNames.0x383eFE8D410285c5CbE1B4F296022640759aA834:
-        "TransparentUpgradeableProxy"
      implementationNames.0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d:
-        "ChallengeManager"
      implementationNames.arb-nova:0x383eFE8D410285c5CbE1B4F296022640759aA834:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0) {
    +++ description: None
      address:
-        "0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0"
+        "arb-nova:0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0"
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb-nova:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "ValidatorUtils"
      implementationNames.arb-nova:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProverHostIo (0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017"
+        "arb-nova:0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017"
      implementationNames.0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017:
-        "OneStepProverHostIo"
      implementationNames.arb-nova:0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017:
+        "OneStepProverHostIo"
    }
```

```diff
    contract OneStepProofEntry (0x944dB3fA4828B5F41ca0E77b97867529F1A899cB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x944dB3fA4828B5F41ca0E77b97867529F1A899cB"
+        "arb-nova:0x944dB3fA4828B5F41ca0E77b97867529F1A899cB"
      values.prover0:
-        "0x19bD7120cD19D6BE6D21f987544e404e47608c16"
+        "arb-nova:0x19bD7120cD19D6BE6D21f987544e404e47608c16"
      values.proverHostIo:
-        "0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017"
+        "arb-nova:0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017"
      values.proverMath:
-        "0x2964CBfC551A76527D42F57131E7f77f9Dce8921"
+        "arb-nova:0x2964CBfC551A76527D42F57131E7f77f9Dce8921"
      values.proverMem:
-        "0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08"
+        "arb-nova:0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08"
      implementationNames.0x944dB3fA4828B5F41ca0E77b97867529F1A899cB:
-        "OneStepProofEntry"
      implementationNames.arb-nova:0x944dB3fA4828B5F41ca0E77b97867529F1A899cB:
+        "OneStepProofEntry"
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb-nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "arb-nova:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.$pastUpgrades.0.2.0:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "arb-nova:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      implementationNames.0xA597e0212971e65f53f288Ff1fFd26A6C8201f83:
-        "TransparentUpgradeableProxy"
      implementationNames.0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
-        "ERC20Outbox"
      implementationNames.arb-nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0xB246421622FB931BdAc20B4a26816F881771Db1e) {
    +++ description: None
      address:
-        "0xB246421622FB931BdAc20B4a26816F881771Db1e"
+        "arb-nova:0xB246421622FB931BdAc20B4a26816F881771Db1e"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xe0978394BEe15a49583fF833a80Bd426c17B68e4"
+        "arb-nova:0xe0978394BEe15a49583fF833a80Bd426c17B68e4"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "arb-nova:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.1.2.0:
-        "0xe0978394BEe15a49583fF833a80Bd426c17B68e4"
+        "arb-nova:0xe0978394BEe15a49583fF833a80Bd426c17B68e4"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb-nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb-nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb-nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb-nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb-nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      values.nativeToken:
-        "0x73C3cDd1418c3F17D54A81148387d93122802E72"
+        "arb-nova:0x73C3cDd1418c3F17D54A81148387d93122802E72"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb-nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      values.rollup:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      implementationNames.0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe0978394BEe15a49583fF833a80Bd426c17B68e4:
-        "ERC20Bridge"
      implementationNames.arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0xe0978394BEe15a49583fF833a80Bd426c17B68e4:
+        "ERC20Bridge"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x1Cc23D484454468C208e4d737288937862b8ecC9"
+        "arb-nova:0x1Cc23D484454468C208e4d737288937862b8ecC9"
      values.$pastUpgrades.0.2.0:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "arb-nova:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.$pastUpgrades.1.2.0:
-        "0xFc9474Db7E2Be79429d456F52741cA18FB7b05c5"
+        "arb-nova:0xFc9474Db7E2Be79429d456F52741cA18FB7b05c5"
      values.$pastUpgrades.2.2.0:
-        "0x1Cc23D484454468C208e4d737288937862b8ecC9"
+        "arb-nova:0x1Cc23D484454468C208e4d737288937862b8ecC9"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0"
+        "arb-nova:0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb-nova:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      implementationNames.0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1Cc23D484454468C208e4d737288937862b8ecC9:
-        "SequencerInbox"
      implementationNames.arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0x1Cc23D484454468C208e4d737288937862b8ecC9:
+        "SequencerInbox"
    }
```

```diff
    contract OneStepProverMemory (0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08"
+        "arb-nova:0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08"
      implementationNames.0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08:
-        "OneStepProverMemory"
      implementationNames.arb-nova:0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08:
+        "OneStepProverMemory"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb-nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4"
+        "arb-nova:0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4"
      values.$pastUpgrades.0.2.0:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "arb-nova:0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
      values.$pastUpgrades.1.2.0:
-        "0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4"
+        "arb-nova:0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.getProxyAdmin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb-nova:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      implementationNames.0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad:
-        "TransparentUpgradeableProxy"
      implementationNames.0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4:
-        "ERC20Inbox"
      implementationNames.arb-nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad:
+        "TransparentUpgradeableProxy"
      implementationNames.arb-nova:0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4:
+        "ERC20Inbox"
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x19bD7120cD19D6BE6D21f987544e404e47608c16)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x2964CBfC551A76527D42F57131E7f77f9Dce8921)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x944dB3fA4828B5F41ca0E77b97867529F1A899cB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

Generated with discovered.json: 0xcf875db756f140d78f5fd16769b3c90b57c02d07

# Diff at Fri, 04 Jul 2025 12:19:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 82973305
- current block number: 82973305

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82973305 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      directlyReceivedPermissions.1.from:
-        "nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
    }
```

```diff
    EOA  (0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.0.from:
-        "nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      receivedPermissions.1.via.0.address:
-        "nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.1.from:
-        "nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      directlyReceivedPermissions.0.from:
-        "nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      receivedPermissions.0.from:
-        "nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb-nova:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.1.from:
-        "nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb-nova:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      receivedPermissions.2.from:
-        "nova:0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb-nova:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      receivedPermissions.3.from:
-        "nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb-nova:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      receivedPermissions.4.from:
-        "nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb-nova:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      receivedPermissions.5.from:
-        "nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      receivedPermissions.6.from:
-        "nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb-nova:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
    }
```

```diff
    EOA  (0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0) {
    +++ description: None
      receivedPermissions.0.from:
-        "nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb-nova:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
    }
```

```diff
    EOA  (0xB246421622FB931BdAc20B4a26816F881771Db1e) {
    +++ description: None
      receivedPermissions.0.from:
-        "nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
+        "arb-nova:0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
    }
```

Generated with discovered.json: 0x87043858a3e28717532f0dd5846d1dea9cf58cc3

# Diff at Wed, 18 Jun 2025 12:24:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 82973305
- current block number: 82973305

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82973305 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x7f2d5608f19b4cfb420ca40da298495d88b45e7e

# Diff at Fri, 23 May 2025 09:41:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 82973305
- current block number: 82973305

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82973305 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
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
+        "admin"
    }
```

```diff
    EOA  (0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xB246421622FB931BdAc20B4a26816F881771Db1e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0xb247ee5011ea968f50d3726e4ee995a5d51e22de

# Diff at Fri, 02 May 2025 17:25:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 82973305
- current block number: 82973305

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82973305 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x93f147456cd7dcb64abecf7a474fe4b81b302c9c

# Diff at Tue, 29 Apr 2025 08:19:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 82973305
- current block number: 82973305

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82973305 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"}]},{"permission":"upgrade","to":"0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"}]},{"permission":"validate","to":"0xB246421622FB931BdAc20B4a26816F881771Db1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

Generated with discovered.json: 0xf6321e546916000eaf9bf996e2de616e27131622

# Diff at Tue, 25 Mar 2025 08:45:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 82417913
- current block number: 82973305

## Description

Minor upgrade of Bridge, Inbox and SequencerInbox:
- logic for tokens with custom decimals
- 7702 adjustments 
- SequencerInbox upgraded to known implementation

## Watched changes

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "0xe0978394BEe15a49583fF833a80Bd426c17B68e4"
      values.$pastUpgrades.1:
+        ["2024-03-08T13:20:18.000Z","0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "0xe0978394BEe15a49583fF833a80Bd426c17B68e4"
      values.$pastUpgrades.0.1:
-        "2024-03-08T13:20:18.000Z"
+        "0x88e38ce4a7e0b667fed77dbc25c187204e98015ee24429093541867beb30cadc"
      values.$pastUpgrades.0.0:
-        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
+        "2025-03-24T10:00:41.000Z"
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      unverified:
-        true
      values.$implementation:
-        "0xFc9474Db7E2Be79429d456F52741cA18FB7b05c5"
+        "0x1Cc23D484454468C208e4d737288937862b8ecC9"
      values.$pastUpgrades.2:
+        ["2025-03-24T12:08:30.000Z","0xf21b441cc66ff6ce0cb9f43f17a82009561559f61736e6efbecc38ef7c9bdcc7",["0x1Cc23D484454468C208e4d737288937862b8ecC9"]]
      values.$upgradeCount:
-        2
+        3
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.bridge:
+        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_AUTHENTICATED_FLAG:
+        "0x40"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.HEADER_LENGTH:
+        40
      values.isUsingFeeToken:
+        true
      values.maxDataSize:
+        104857
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.rollup:
+        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
      derivedName:
-        ""
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4"
      values.$pastUpgrades.1:
+        ["2024-03-08T13:20:18.000Z","0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]
      values.$pastUpgrades.0.2:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xf21b441cc66ff6ce0cb9f43f17a82009561559f61736e6efbecc38ef7c9bdcc7"
      values.$pastUpgrades.0.1:
-        "2024-03-08T13:20:18.000Z"
+        ["0x001B9eDD86D3674fc8aACc98Bf85f08851281Bc4"]
      values.$pastUpgrades.0.0:
-        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
+        "2025-03-24T12:08:30.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |   54 +
 .../{.flat@82417913 => .flat}/Inbox/ERC20Inbox.sol |   92 +-
 .../nova/.flat/SequencerInbox/SequencerInbox.sol   | 1109 ++++++++++++++++++++
 3 files changed, 1244 insertions(+), 11 deletions(-)
```

Generated with discovered.json: 0x0c0dbd9c618bacdf2ecf8b6ab9185507020b1ece

# Diff at Thu, 06 Mar 2025 09:39:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 82417913
- current block number: 82417913

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82417913 (main branch discovery), not current.

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x56d78bc34f0fb904fb40e60feacd454d93fca278

# Diff at Tue, 04 Mar 2025 10:42:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 82417913
- current block number: 82417913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82417913 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        55663578
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        55663578
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        55663578
    }
```

```diff
    contract OneStepProver0 (0x19bD7120cD19D6BE6D21f987544e404e47608c16) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        75267048
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      sinceBlock:
+        55663578
    }
```

```diff
    contract OneStepProverMath (0x2964CBfC551A76527D42F57131E7f77f9Dce8921) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        75267056
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        55663578
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        47798413
    }
```

```diff
    contract OneStepProverHostIo (0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        75267060
    }
```

```diff
    contract OneStepProofEntry (0x944dB3fA4828B5F41ca0E77b97867529F1A899cB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        75267067
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        55663578
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        55663578
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        55663578
    }
```

```diff
    contract OneStepProverMemory (0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        75267052
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        55663578
    }
```

Generated with discovered.json: 0x13fdf6597258d5d53eb8ff2f476777cca937f0e8

# Diff at Thu, 27 Feb 2025 11:47:58 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 82417913
- current block number: 82417913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 82417913 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

Generated with discovered.json: 0xe868d675841dfe1ed07a9c823e7db88ddd867191

# Diff at Fri, 21 Feb 2025 13:53:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 81006902
- current block number: 82417913

## Description

Add operator addresses.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.to:
-        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
+        "0xB246421622FB931BdAc20B4a26816F881771Db1e"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        3
      values.stakerCount:
-        1
+        2
      values.validators.0:
-        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
+        "0xB246421622FB931BdAc20B4a26816F881771Db1e"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.to:
-        "0xe603d3FcB75b0Af72F0e616d002091109d7ECc5b"
+        "0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0"
      values.batchPosters.0:
-        "0xe603d3FcB75b0Af72F0e616d002091109d7ECc5b"
+        "0x3A8F935c5722535A8F34BD176d57D130Cb37d3A0"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81006902 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x9b67dca724ba42ed33b52c118f4320dd48043840

# Diff at Thu, 20 Feb 2025 12:23:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 81006902
- current block number: 81006902

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81006902 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xf5bfb99442e09d39e739b7494b5e18a73922f180

# Diff at Tue, 04 Feb 2025 12:34:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 81006902
- current block number: 81006902

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81006902 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x31af573681bb042e0c98aa514c006a6a6c9b389d

# Diff at Mon, 20 Jan 2025 11:10:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 81006902
- current block number: 81006902

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81006902 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
      issuedPermissions.2.to:
+        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.0.target:
-        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      directlyReceivedPermissions.1.target:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      directlyReceivedPermissions.1.from:
+        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      directlyReceivedPermissions.0.target:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      directlyReceivedPermissions.0.from:
+        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      receivedPermissions.6.target:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      receivedPermissions.6.from:
+        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      receivedPermissions.5.target:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      receivedPermissions.5.from:
+        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      receivedPermissions.4.target:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      receivedPermissions.4.from:
+        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      receivedPermissions.3.target:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      receivedPermissions.3.from:
+        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      receivedPermissions.2.target:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      receivedPermissions.2.from:
+        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      receivedPermissions.1.target:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      receivedPermissions.1.from:
+        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      receivedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.0.from:
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.1.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.target:
-        "0xe603d3FcB75b0Af72F0e616d002091109d7ECc5b"
      issuedPermissions.0.to:
+        "0xe603d3FcB75b0Af72F0e616d002091109d7ECc5b"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      issuedPermissions.0.to:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
    }
```

Generated with discovered.json: 0xca7a760985e6b19e484767b2573ab3899573145a

# Diff at Wed, 08 Jan 2025 10:45:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 81006902
- current block number: 81006902

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81006902 (main branch discovery), not current.

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xbb2a53e3b99441b355e054e212545f41d25783ee

# Diff at Tue, 24 Dec 2024 09:42:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8f52aa11293aef791f10e1b8317bef0d461a04f9 block: 80805453
- current block number: 81006902

## Description

Config related: Celestia Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 80805453 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xb660accfc7ec3e63ad9fc63a6d60d3a4860cff7c

# Diff at Tue, 17 Dec 2024 10:57:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9edac19694da1dabeb0cfe9be0be2735a693c621 block: 76950926
- current block number: 80766159

## Description

ArbOS v32 upgrade with unused fastConfirmer.

## Watched changes

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x5CAF2e861bB26aA0576583677488694FCf30e514"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xF7C1c37406626B305f5136364016425f487516a3"
      values.$pastUpgrades.1:
+        ["2024-11-25T17:02:54.000Z","0x1eb946f2394c7e8be67336259aa449fbc92fe2b4cf2850c41d2c8dcf54e0193a",["0xF7C1c37406626B305f5136364016425f487516a3","0x5CAF2e861bB26aA0576583677488694FCf30e514"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v11 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d"
      values.$pastUpgrades.2:
+        ["2024-11-25T17:02:54.000Z","0x1eb946f2394c7e8be67336259aa449fbc92fe2b4cf2850c41d2c8dcf54e0193a",["0x8F77B0d1e891C87F2987Afb476d74e2a71341b0d"]]
      values.$pastUpgrades.1:
+        ["2024-11-25T16:47:09.000Z","0x35689ea16b8ccd3c7074f1eebde2f4fcfa94bdfb314450e736632eba04ebbb18",["0xDCa690cB409FF3FBDC85F12179c4718Fa080Fb38"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0x944dB3fA4828B5F41ca0E77b97867529F1A899cB"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes:
-        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0xFc9474Db7E2Be79429d456F52741cA18FB7b05c5"
      values.$pastUpgrades.1:
+        ["2024-11-25T16:47:09.000Z","0x35689ea16b8ccd3c7074f1eebde2f4fcfa94bdfb314450e736632eba04ebbb18",["0xFc9474Db7E2Be79429d456F52741cA18FB7b05c5"]]
      values.$upgradeCount:
-        1
+        2
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.DATA_AUTHENTICATED_FLAG:
-        "0x40"
      values.HEADER_LENGTH:
-        40
      values.maxDataSize:
-        104857
      values.rollup:
-        "0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"
      derivedName:
-        "SequencerInbox"
+        ""
      unverified:
+        true
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x19bD7120cD19D6BE6D21f987544e404e47608c16)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x2964CBfC551A76527D42F57131E7f77f9Dce8921)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x77E1b4F2e1bf192975c59bdF44EcB5a2D42AF017)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x944dB3fA4828B5F41ca0E77b97867529F1A899cB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xfaD0d420ffF503a40E9CDcb90ff0328E46f06c08)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@76950926 => .flat}/OneStepProver0.sol   | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol => /dev/null | 751 ----------------
 9 files changed, 2869 insertions(+), 1700 deletions(-)
```

Generated with discovered.json: 0xb6cda6bfbccf0c8a336a70888c6f9b449780b810

# Diff at Fri, 06 Dec 2024 08:23:38 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x435607831f88ea1aaabfc5a018f6dc1996eb540d

# Diff at Fri, 29 Nov 2024 11:28:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x4aa2d7b023208e1cf01137427c3c726a12b54ff2

# Diff at Fri, 15 Nov 2024 08:18:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}]}
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
-        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
+        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.0.via.0:
+        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
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
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x21e2a4e15d483fb517b7a290a54b06f2ada2eaa0

# Diff at Mon, 04 Nov 2024 08:12:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
+        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
      issuedPermissions.2.via.0:
-        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
+        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.1.via.0:
+        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"}
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x9319fa94dbb2727d88287cf805148f666630bc14

# Diff at Tue, 29 Oct 2024 13:24:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x11b0c068afb99205b38b77b23ace2acc285acff0

# Diff at Tue, 29 Oct 2024 08:55:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"
      issuedPermissions.2.via.0:
+        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"}]
    }
```

Generated with discovered.json: 0xb4d42dc4c3761c58ffd5b39724d57f0dc97dd416

# Diff at Mon, 28 Oct 2024 14:09:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x10Fe3cb853F7ef551E1598d91436e95d41Aea45a"]
    }
```

Generated with discovered.json: 0xdebd3c8bd2acbfe3a05522d60ee78962976e1269

# Diff at Wed, 23 Oct 2024 14:37:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x76a197539eF9670c75F36997b8f1DeA593A1b827"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v11 wasmModuleRoot"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v11 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
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
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

Generated with discovered.json: 0xc1331b14903c3e1f0b8c2e3181249ccd2b021f28

# Diff at Mon, 21 Oct 2024 12:53:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x1ee712ab883fa9f0e05a6e914bfd3c60f30df7a3

# Diff at Mon, 21 Oct 2024 11:15:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
      values.$pastUpgrades.0.1:
-        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
      values.$pastUpgrades.0.1:
-        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x37be7a29db10d18501dcf4d0243fa6aefeeba21cbc17832ef16ccf288ce58ef2"
    }
```

Generated with discovered.json: 0x10033d5e9895decfbd5c0da8d4e058050468cc33

# Diff at Wed, 16 Oct 2024 11:46:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x76a197539eF9670c75F36997b8f1DeA593A1b827","via":[]}
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0xe603d3FcB75b0Af72F0e616d002091109d7ECc5b"
    }
```

Generated with discovered.json: 0x3972ba98a299141c445992eab79e4187ff0d26bb

# Diff at Mon, 14 Oct 2024 11:00:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
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
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
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
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
    }
```

```diff
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

Generated with discovered.json: 0x37c416beab6e9efd14324f891519608460c17be7

# Diff at Tue, 01 Oct 2024 11:14:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 76950926
- current block number: 76950926

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76950926 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]]]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x09824fe72BFF474d16D9c2774432E381BBD60662"]]]
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T13:20:18.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

Generated with discovered.json: 0xd92c2e5a0b439c794c142166af9ca5064d9e846b

# Diff at Wed, 25 Sep 2024 10:31:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 75299946
- current block number: 76950926

## Description

DAC keyset update from 1/1 to 1/2.

## Watched changes

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.membersCount:
-        1
+        2
      values.dacKeyset.blsSignatures.1:
+        "YAImQLIbSOCL4/9H1Cz7q4xAOZPVli5CulIEqvuMF4JjZwEhRDa8n3tie56cEykcxhgd8kixHEdOm2YcGOetbcUN7HUgfDpVMEqspHjIYzp06QM/IEC0SC2oUxsXorqewxPqukssVdSDsZQ26R/A9uZ2+wpHhGd8V9itDIRK+1HXzECMMd02yic2cyGjmOxPXAGfMay9PnLViYszEOKRNsiRWBO6Z6n8VP3GJF4S4/XFPHQ58wFxIi8zWR12BvzCbw6UUKohmrC2SIHtu9hJ6rbj3EcXlNGa/YsGatysgfcVR20/rMysbmqy7E1zhsYwvhRQaOBUpoVUzH4DajylpiJdWpbk46dlq0127k2vtGgWXNErbBRES1IK2cDfbP+Ztw=="
      values.dacKeyset.blsSignatures.0:
-        "YBWzTXaVO10A2bGxmXd05VrZ459e8tmeikH1duygtJ4YQRHbRMqSfKYL70moUWNp5xn0zhuvn3IIbTHU9QXSshb+NZQZIc7KuHFYFGJqXTkCp7pFXxIjIe4OLF4DGNedhAco+CG0t2Z3Izrb5E/Mx1nPp5Bj2CjHrJgH3KERfC//y7WtJkxjHRn3Vy8/6hyO7Qcn3uKftNi75ikkmZnldI1P9UQxaqVHqgW/Sp68ju6LI/omVsdK2Yn9+R1F2C2fbQySLyLeT2J3EU9cHFoxMpmBXg3+ACMi5JFLEEt6iMOj/eE3AKo+u+iIWOIrsARwzAfNEb2fJk+Dh01F89NfwBMpXx6UEhpyamXe54X22kXm/suWMKqj9ZLJtTXg21hkcA=="
+        "YBlgGETG0JAkF0lRA3szPn3L5opNuQWdu2c9OsvmyiFTuut4zl6E8tcgnXSzlX1cwxFb/dKGoetJtdHbrfN4a70U5wD5NXsMjvZGJC9grFkyEQ4gQfOfMcW/NX5CEp3FvBfLYp9lTR/sAjU/uZ7JNGMj1ol0xyYkOkyAQvbN7ri9z05Jo3H8hhHYpvAkaIpgVQw2nSQg1nlMMhmUdn0g2XEBzijYfDvQC3MZDurPXmiC9eARVq+gLXF57By/3m1u8hZoshxjU2aG24ukLjEXEqGvqDR158jZpQE7ZMtv8c7ma1XSUSXLqm1LQMWlK2FRJwErkKGyUQM4luTI4fGoycDnpdQq2eI6+TZXm2PYY1nJrPo7lMghYL+CLkCSCvMmPQ=="
      values.keySetUpdates:
-        1
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75299946 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xff8264538b3cc61536270a4379d5d98c0b79fb2d

# Diff at Sun, 01 Sep 2024 08:48:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 75299946
- current block number: 75299946

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75299946 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "ArbOS v11 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
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

Generated with discovered.json: 0xefcf9445b1f07719fc7066a741eb4924e815a54d

# Diff at Fri, 23 Aug 2024 09:58:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 75299946
- current block number: 75299946

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75299946 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xa521d915b392a5579b9a10b0a2f57d5aeece9871

# Diff at Thu, 22 Aug 2024 12:15:40 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 74469390
- current block number: 75299946

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBWzTXaVO10A2bGxmXd05VrZ459e8tmeikH1duygtJ4YQRHbRMqSfKYL70moUWNp5xn0zhuvn3IIbTHU9QXSshb+NZQZIc7KuHFYFGJqXTkCp7pFXxIjIe4OLF4DGNedhAco+CG0t2Z3Izrb5E/Mx1nPp5Bj2CjHrJgH3KERfC//y7WtJkxjHRn3Vy8/6hyO7Qcn3uKftNi75ikkmZnldI1P9UQxaqVHqgW/Sp68ju6LI/omVsdK2Yn9+R1F2C2fbQySLyLeT2J3EU9cHFoxMpmBXg3+ACMi5JFLEEt6iMOj/eE3AKo+u+iIWOIrsARwzAfNEb2fJk+Dh01F89NfwBMpXx6UEhpyamXe54X22kXm/suWMKqj9ZLJtTXg21hkcA=="]
    }
```

Generated with discovered.json: 0x484e54e1326ffcb072ed7b99505b893e065a8625

# Diff at Wed, 21 Aug 2024 10:08:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 74469390
- current block number: 74469390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]},{"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","via":[]},{"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834","via":[]},{"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","via":[]},{"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","via":[]},{"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","via":[]},{"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

Generated with discovered.json: 0x981c68dc7f14a65e059024f5d4dc28acba34656a

# Diff at Fri, 09 Aug 2024 12:04:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 74469390
- current block number: 74469390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      assignedPermissions.upgrade.5:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      assignedPermissions.upgrade.4:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      assignedPermissions.upgrade.3:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      assignedPermissions.upgrade.2:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      assignedPermissions.upgrade.1:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      assignedPermissions.upgrade.0:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

Generated with discovered.json: 0xdc9c4c2c96a94f4a6f2125e019aaef2d394a928d

# Diff at Fri, 09 Aug 2024 10:14:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 74469390
- current block number: 74469390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"]
      assignedPermissions.upgrade:
+        ["0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"]
      assignedPermissions.upgrade:
+        ["0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","0x383eFE8D410285c5CbE1B4F296022640759aA834","0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"]
    }
```

Generated with discovered.json: 0x821f94cff7e5ef847e878545c232714e518f85ed

# Diff at Tue, 30 Jul 2024 11:18:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 74469390
- current block number: 74469390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0xb202839bf951a0726b981784616a7c5858e89925

# Diff at Mon, 22 Jul 2024 12:29:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 74469390

## Description

Initial discovery: First L3 Optimium with an Optimium as host chain (nova). Admin EOA, unverified contracts, native token not on coingecko (TVL will be zero). Otherwise standard Orbit stack with custom native token.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad)
    +++ description: None
```
