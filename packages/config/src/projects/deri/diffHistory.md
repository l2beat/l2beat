Generated with discovered.json: 0x8febabe4e5fcea7a8f8e8bc920e0f90fa90edc39

# Diff at Fri, 26 Sep 2025 12:45:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1750333028
- current timestamp: 1750333028

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1750333028 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x5cfa57df1199a89fbf17eb20a628ffabc0abd542

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xba72a3648425988542823e165366247b144d1028

# Diff at Mon, 14 Jul 2025 13:11:49 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 348970853
- current block number: 348970853

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348970853 (main branch discovery), not current.

```diff
    EOA  (0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE) {
    +++ description: None
      address:
-        "0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
+        "arb1:0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.0.2.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
+        "arb1:0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      values.executors.0:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
+        "arb1:0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      implementationNames.0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9:
-        "TransparentUpgradeableProxy"
      implementationNames.0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
-        "UpgradeExecutor"
      implementationNames.arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
+        "UpgradeExecutor"
    }
```

```diff
    contract OneStepProofEntry (0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff"
+        "arb1:0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff"
      values.prover0:
-        "0xce4b9839C83cB0650B34659B8Fa44609A45b1010"
+        "arb1:0xce4b9839C83cB0650B34659B8Fa44609A45b1010"
      values.proverHostIo:
-        "0x742F0619adB993809B1B00E493b5bdb4085B735e"
+        "arb1:0x742F0619adB993809B1B00E493b5bdb4085B735e"
      values.proverMath:
-        "0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391"
+        "arb1:0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391"
      values.proverMem:
-        "0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC"
+        "arb1:0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC"
      implementationNames.0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff:
-        "OneStepProofEntry"
      implementationNames.arb1:0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff:
+        "OneStepProofEntry"
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
+        "arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
      values.$pastUpgrades.0.2.0:
-        "0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
+        "arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.rollup:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      implementationNames.0x0fF7A97caAb356c5507e5355b6819CB8b93d5591:
-        "TransparentUpgradeableProxy"
      implementationNames.0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C:
-        "RollupEventInbox"
      implementationNames.arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C:
+        "RollupEventInbox"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.owner:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      implementationNames.0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91:
-        "ProxyAdmin"
      implementationNames.arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91:
+        "ProxyAdmin"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb1:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126"
+        "arb1:0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126"
      values.$pastUpgrades.0.2.0:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "arb1:0x09824fe72BFF474d16D9c2774432E381BBD60662"
      values.$pastUpgrades.1.2.0:
-        "0x16a278342b5521F56849e877294203dF9683F678"
+        "arb1:0x16a278342b5521F56849e877294203dF9683F678"
      values.$pastUpgrades.2.2.0:
-        "0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126"
+        "arb1:0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.osp:
-        "0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff"
+        "arb1:0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff"
      values.resultReceiver:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      implementationNames.0x383eFE8D410285c5CbE1B4F296022640759aA834:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126:
-        "ChallengeManager"
      implementationNames.arb1:0x383eFE8D410285c5CbE1B4F296022640759aA834:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c) {
    +++ description: None
      address:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
+        "arb1:0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    EOA  (0x56A37e21FdA325CD8bf9F04253a036763a9aB6f9) {
    +++ description: None
      address:
-        "0x56A37e21FdA325CD8bf9F04253a036763a9aB6f9"
+        "arb1:0x56A37e21FdA325CD8bf9F04253a036763a9aB6f9"
    }
```

```diff
    contract OneStepProverMath (0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391"
+        "arb1:0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391"
      implementationNames.0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391:
-        "OneStepProverMath"
      implementationNames.arb1:0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391:
+        "OneStepProverMath"
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "ValidatorUtils"
      implementationNames.arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProverHostIo (0x742F0619adB993809B1B00E493b5bdb4085B735e) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x742F0619adB993809B1B00E493b5bdb4085B735e"
+        "arb1:0x742F0619adB993809B1B00E493b5bdb4085B735e"
      implementationNames.0x742F0619adB993809B1B00E493b5bdb4085B735e:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x742F0619adB993809B1B00E493b5bdb4085B735e:
+        "OneStepProverHostIo"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      values.$admin:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.$implementation.0:
-        "0xFD72BF47Ee50c9ED583acdd20672f29631eBa587"
+        "arb1:0xFD72BF47Ee50c9ED583acdd20672f29631eBa587"
      values.$implementation.1:
-        "0x140240BD6de2b4Cfa78c247b2cad5d507892DE02"
+        "arb1:0x140240BD6de2b4Cfa78c247b2cad5d507892DE02"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "arb1:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.0.2.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "arb1:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.1.2.0:
-        "0xFD72BF47Ee50c9ED583acdd20672f29631eBa587"
+        "arb1:0xFD72BF47Ee50c9ED583acdd20672f29631eBa587"
      values.$pastUpgrades.1.2.1:
-        "0x140240BD6de2b4Cfa78c247b2cad5d507892DE02"
+        "arb1:0x140240BD6de2b4Cfa78c247b2cad5d507892DE02"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.challengeManager:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb1:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      values.inbox:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.loserStakeEscrow:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
+        "arb1:0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      values.outbox:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      values.owner:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.rollupEventInbox:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
+        "arb1:0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
      values.validatorUtils:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.validatorWalletCreator:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "arb1:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x846387C3D6001F74170455B1074D01f05eB3067a:
-        "RollupProxy"
      implementationNames.0xFD72BF47Ee50c9ED583acdd20672f29631eBa587:
-        "RollupAdminLogic"
      implementationNames.0x140240BD6de2b4Cfa78c247b2cad5d507892DE02:
-        "RollupUserLogic"
      implementationNames.arb1:0x846387C3D6001F74170455B1074D01f05eB3067a:
+        "RollupProxy"
      implementationNames.arb1:0xFD72BF47Ee50c9ED583acdd20672f29631eBa587:
+        "RollupAdminLogic"
      implementationNames.arb1:0x140240BD6de2b4Cfa78c247b2cad5d507892DE02:
+        "RollupUserLogic"
    }
```

```diff
    EOA  (0x97e3Dc113709a3F1492cf440feC369929a7Ef525) {
    +++ description: None
      address:
-        "0x97e3Dc113709a3F1492cf440feC369929a7Ef525"
+        "arb1:0x97e3Dc113709a3F1492cf440feC369929a7Ef525"
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.$pastUpgrades.0.2.0:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      implementationNames.0xA597e0212971e65f53f288Ff1fFd26A6C8201f83:
-        "TransparentUpgradeableProxy"
      implementationNames.0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "Outbox"
      implementationNames.arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
+        "Outbox"
    }
```

```diff
    EOA  (0xa634397c4E5F12C5312c535a1DaBBaae34Ee166e) {
    +++ description: None
      address:
-        "0xa634397c4E5F12C5312c535a1DaBBaae34Ee166e"
+        "arb1:0xa634397c4E5F12C5312c535a1DaBBaae34Ee166e"
    }
```

```diff
    contract CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      address:
-        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
+        "arb1:0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x7785047A920B43d23D181C6E68fa9405c874997c"
+        "arb1:0x7785047A920B43d23D181C6E68fa9405c874997c"
      values.$pastUpgrades.0.2.0:
-        "0x7785047A920B43d23D181C6E68fa9405c874997c"
+        "arb1:0x7785047A920B43d23D181C6E68fa9405c874997c"
      values.counterpartGateway:
-        "0x56A37e21FdA325CD8bf9F04253a036763a9aB6f9"
+        "arb1:0x56A37e21FdA325CD8bf9F04253a036763a9aB6f9"
      values.inbox:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.owner:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.router:
-        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "arb1:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7785047A920B43d23D181C6E68fa9405c874997c:
-        "L1CustomGateway"
      implementationNames.arb1:0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x7785047A920B43d23D181C6E68fa9405c874997c:
+        "L1CustomGateway"
    }
```

```diff
    contract ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0xB155C77a440DA7c282993a89FeA609598293017A"
+        "arb1:0xB155C77a440DA7c282993a89FeA609598293017A"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"
+        "arb1:0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"
      values.$pastUpgrades.0.2.0:
-        "0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"
+        "arb1:0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"
      values.counterpartGateway:
-        "0x97e3Dc113709a3F1492cf440feC369929a7Ef525"
+        "arb1:0x97e3Dc113709a3F1492cf440feC369929a7Ef525"
      values.inbox:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.l2BeaconProxyFactory:
-        "0xa634397c4E5F12C5312c535a1DaBBaae34Ee166e"
+        "arb1:0xa634397c4E5F12C5312c535a1DaBBaae34Ee166e"
      values.router:
-        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "arb1:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xB155C77a440DA7c282993a89FeA609598293017A:
-        "TransparentUpgradeableProxy"
      implementationNames.0xA8531c989b2f8531e123F1daf2edAe83bf4aa190:
-        "L1ERC20Gateway"
      implementationNames.arb1:0xB155C77a440DA7c282993a89FeA609598293017A:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xA8531c989b2f8531e123F1daf2edAe83bf4aa190:
+        "L1ERC20Gateway"
    }
```

```diff
    contract OneStepProver0 (0xce4b9839C83cB0650B34659B8Fa44609A45b1010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xce4b9839C83cB0650B34659B8Fa44609A45b1010"
+        "arb1:0xce4b9839C83cB0650B34659B8Fa44609A45b1010"
      implementationNames.0xce4b9839C83cB0650B34659B8Fa44609A45b1010:
-        "OneStepProver0"
      implementationNames.arb1:0xce4b9839C83cB0650B34659B8Fa44609A45b1010:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0) {
    +++ description: None
      address:
-        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
+        "arb1:0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
+        "arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
      values.$pastUpgrades.0.2.0:
-        "0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
+        "arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      values.rollup:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      implementationNames.0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0:
-        "TransparentUpgradeableProxy"
      implementationNames.0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0:
-        "Bridge"
      implementationNames.arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0:
+        "Bridge"
    }
```

```diff
    contract OneStepProverMemory (0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC"
+        "arb1:0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC"
      implementationNames.0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC:
-        "OneStepProverMemory"
      implementationNames.arb1:0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC:
+        "OneStepProverMemory"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887"
+        "arb1:0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887"
      values.$pastUpgrades.0.2.0:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "arb1:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.$pastUpgrades.1.2.0:
-        "0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"
+        "arb1:0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"
      values.$pastUpgrades.2.2.0:
-        "0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887"
+        "arb1:0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
+        "arb1:0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      implementationNames.0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77:
-        "TransparentUpgradeableProxy"
      implementationNames.0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887:
-        "SequencerInbox"
      implementationNames.arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887:
+        "SequencerInbox"
    }
```

```diff
    contract GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "arb1:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0x2fB33D8e4a8E989E7814D914973096736ed718b5"
+        "arb1:0x2fB33D8e4a8E989E7814D914973096736ed718b5"
      values.$pastUpgrades.0.2.0:
-        "0x2fB33D8e4a8E989E7814D914973096736ed718b5"
+        "arb1:0x2fB33D8e4a8E989E7814D914973096736ed718b5"
      values.counterpartGateway:
-        "0xf82D43FDe2803362ec9F6EaDC1e043399d7D4eC6"
+        "arb1:0xf82D43FDe2803362ec9F6EaDC1e043399d7D4eC6"
      values.defaultGateway:
-        "0xB155C77a440DA7c282993a89FeA609598293017A"
+        "arb1:0xB155C77a440DA7c282993a89FeA609598293017A"
      values.inbox:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.owner:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xe507b9EF563DB6CcFDcE270160C50b2005BeED20:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2fB33D8e4a8E989E7814D914973096736ed718b5:
-        "L1GatewayRouter"
      implementationNames.arb1:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x2fB33D8e4a8E989E7814D914973096736ed718b5:
+        "L1GatewayRouter"
    }
```

```diff
    EOA  (0xf82D43FDe2803362ec9F6EaDC1e043399d7D4eC6) {
    +++ description: None
      address:
-        "0xf82D43FDe2803362ec9F6EaDC1e043399d7D4eC6"
+        "arb1:0xf82D43FDe2803362ec9F6EaDC1e043399d7D4eC6"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      values.$admin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.$implementation:
-        "0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d"
+        "arb1:0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d"
      values.$pastUpgrades.0.2.0:
-        "0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
+        "arb1:0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
      values.$pastUpgrades.1.2.0:
-        "0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d"
+        "arb1:0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d"
      values.bridge:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      values.getProxyAdmin:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      values.sequencerInbox:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      implementationNames.0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad:
-        "TransparentUpgradeableProxy"
      implementationNames.0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d:
-        "Inbox"
      implementationNames.arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d:
+        "Inbox"
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x742F0619adB993809B1B00E493b5bdb4085B735e)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99)
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xce4b9839C83cB0650B34659B8Fa44609A45b1010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

Generated with discovered.json: 0x77a1816993f375f6eb7607550a58165a6b08e69d

# Diff at Fri, 04 Jul 2025 12:18:57 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 348970853
- current block number: 348970853

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348970853 (main branch discovery), not current.

```diff
    EOA  (0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb1:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
+        "arb1:0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0xB155C77a440DA7c282993a89FeA609598293017A"
+        "arb1:0xB155C77a440DA7c282993a89FeA609598293017A"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      directlyReceivedPermissions.7.from:
-        "arbitrum:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      directlyReceivedPermissions.8.from:
-        "arbitrum:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "arb1:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      directlyReceivedPermissions.9.from:
-        "arbitrum:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
    }
```

```diff
    EOA  (0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.0.from:
-        "arbitrum:0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.1.from:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.2.from:
-        "arbitrum:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "arb1:0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.3.from:
-        "arbitrum:0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "arb1:0x383eFE8D410285c5CbE1B4F296022640759aA834"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.4.from:
-        "arbitrum:0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.5.from:
-        "arbitrum:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
+        "arb1:0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.6.from:
-        "arbitrum:0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
+        "arb1:0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.7.from:
-        "arbitrum:0xB155C77a440DA7c282993a89FeA609598293017A"
+        "arb1:0xB155C77a440DA7c282993a89FeA609598293017A"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.8.from:
-        "arbitrum:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "arb1:0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      receivedPermissions.9.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.9.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.9.from:
-        "arbitrum:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "arb1:0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      receivedPermissions.10.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.10.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.10.from:
-        "arbitrum:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "arb1:0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      receivedPermissions.11.via.1.address:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.11.via.0.address:
-        "arbitrum:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "arb1:0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      receivedPermissions.11.from:
-        "arbitrum:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "arb1:0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "arb1:0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    EOA  (0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "arb1:0x846387C3D6001F74170455B1074D01f05eB3067a"
    }
```

Generated with discovered.json: 0xd8bc6a6d0695701554b3663ad768c907769bf162

# Diff at Thu, 19 Jun 2025 11:37:29 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 339286979
- current block number: 348970853

## Description

late upgrade to standard orbit contracts.

## Watched changes

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"
+        "0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887"
      values.$pastUpgrades.2:
+        ["2023-11-19T04:23:39.000Z","0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]
      values.$pastUpgrades.1.2:
-        "2023-11-19T04:23:39.000Z"
+        "2025-05-22T01:59:12.000Z"
      values.$pastUpgrades.1.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x64f376646580d25cc092327877e062bbd953ecbfa7600864478b6aec7ffb97ff"
      values.$pastUpgrades.1.0:
-        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
+        ["0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"]
      values.$pastUpgrades.0.2:
-        "2025-05-22T01:59:12.000Z"
+        ["0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887"]
      values.$pastUpgrades.0.1:
-        "0x64f376646580d25cc092327877e062bbd953ecbfa7600864478b6aec7ffb97ff"
+        "2025-06-19T02:15:30.000Z"
      values.$pastUpgrades.0.0:
-        ["0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"]
+        "0x6f84858d5890cc27277102d07d76b6db8b418675c23feccb0582ae91a7cfc598"
      values.$upgradeCount:
-        2
+        3
      implementationNames.0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB:
-        "SequencerInbox"
      implementationNames.0xE742BbD0dD0A9E2cc6dB4C8d363DF06801A85887:
+        "SequencerInbox"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
+        "0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d"
      values.$pastUpgrades.1:
+        ["2023-11-19T04:23:39.000Z","0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095",["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]]
      values.$pastUpgrades.0.2:
-        "2023-11-19T04:23:39.000Z"
+        "2025-06-19T02:15:30.000Z"
      values.$pastUpgrades.0.1:
-        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
+        "0x6f84858d5890cc27277102d07d76b6db8b418675c23feccb0582ae91a7cfc598"
      values.$pastUpgrades.0.0.0:
-        "0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
+        "0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d"
      values.$upgradeCount:
-        1
+        2
      implementationNames.0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA:
-        "Inbox"
      implementationNames.0xBaf02424c26b01214aBdeB7F5660C77D8F26C18d:
+        "Inbox"
    }
```

## Source code changes

```diff
.../{.flat@339286979 => .flat}/Inbox/Inbox.sol     | 52 +++++++++++++++++-----
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++---
 2 files changed, 59 insertions(+), 17 deletions(-)
```

Generated with discovered.json: 0x07cb0feb45148ba77735c65f562953bdf8428e75

# Diff at Wed, 18 Jun 2025 12:22:00 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 339286979
- current block number: 339286979

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 339286979 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xab1299bbef28e66a0b3b064b824827d4eefc1595

# Diff at Tue, 27 May 2025 08:31:04 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 339286979
- current block number: 339286979

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 339286979 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
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

Generated with discovered.json: 0x7f956286cc7f58785947bc7165b546462c964cd0

# Diff at Fri, 23 May 2025 09:41:11 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 339286979
- current block number: 339286979

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 339286979 (main branch discovery), not current.

```diff
    EOA  (0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.permission:
-        "act"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x846387C3D6001F74170455B1074D01f05eB3067a"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "act"
      directlyReceivedPermissions.1.from:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      directlyReceivedPermissions.9.role:
+        "admin"
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
    EOA  (0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c) {
    +++ description: None
      receivedPermissions.11.role:
+        "admin"
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
    EOA  (0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0xbc96dbdd35d50e898af91ee71760d2917122cdcf

# Diff at Thu, 22 May 2025 08:30:34 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@28ec750f325ec979450bcc4eaac304d60b8b1276 block: 287770865
- current block number: 339286979

## Description

v32 upgrade to standard contracts.

## Watched changes

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
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
      sourceHashes.0:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126"
      values.$pastUpgrades.2:
+        ["2025-05-22T01:59:12.000Z","0x64f376646580d25cc092327877e062bbd953ecbfa7600864478b6aec7ffb97ff",["0x16a278342b5521F56849e877294203dF9683F678"]]
      values.$pastUpgrades.1:
+        ["2023-11-19T04:23:39.000Z","0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095",["0x09824fe72BFF474d16D9c2774432E381BBD60662"]]
      values.$pastUpgrades.0.2:
-        "2023-11-19T04:23:39.000Z"
+        ["0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126"]
      values.$pastUpgrades.0.1:
-        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
+        "0x675c13b89d4e518aa8211acf9ebcdc1d1e47afa7476f20263dbb7660d42949c6"
      values.$pastUpgrades.0.0:
-        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
+        "2025-05-22T02:07:22.000Z"
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff"
      implementationNames.0x09824fe72BFF474d16D9c2774432E381BBD60662:
-        "ChallengeManager"
      implementationNames.0xC6adDa3fa1a2Cb75d585eCfE14e1E1Db102B4126:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.1:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      sourceHashes.0:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x140240BD6de2b4Cfa78c247b2cad5d507892DE02"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xFD72BF47Ee50c9ED583acdd20672f29631eBa587"
      values.$pastUpgrades.1:
+        ["2023-11-19T04:23:39.000Z","0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]
      values.$pastUpgrades.0.2.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x140240BD6de2b4Cfa78c247b2cad5d507892DE02"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xFD72BF47Ee50c9ED583acdd20672f29631eBa587"
      values.$pastUpgrades.0.1:
-        "2023-11-19T04:23:39.000Z"
+        "0x675c13b89d4e518aa8211acf9ebcdc1d1e47afa7476f20263dbb7660d42949c6"
      values.$pastUpgrades.0.0:
-        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
+        "2025-05-22T02:07:22.000Z"
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
      implementationNames.0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754:
-        "RollupAdminLogic"
      implementationNames.0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A:
-        "RollupUserLogic"
      implementationNames.0xFD72BF47Ee50c9ED583acdd20672f29631eBa587:
+        "RollupAdminLogic"
      implementationNames.0x140240BD6de2b4Cfa78c247b2cad5d507892DE02:
+        "RollupUserLogic"
    }
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
      sourceHashes.0:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"
      values.$pastUpgrades.1:
+        ["2023-11-19T04:23:39.000Z","0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]
      values.$pastUpgrades.0.2:
-        "2023-11-19T04:23:39.000Z"
+        "2025-05-22T01:59:12.000Z"
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x64f376646580d25cc092327877e062bbd953ecbfa7600864478b6aec7ffb97ff"
      values.$pastUpgrades.0.0:
-        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
+        ["0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB"]
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
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
      implementationNames.0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
-        "SequencerInbox"
      implementationNames.0xeE5a0A8e5d08474F21933d17f4EE076B3eAdBaAB:
+        "SequencerInbox"
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0A9F7BD2182EAC312ec99AFcF684Ff40086331Ff)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x5e5aBaD78aa0a0773a43606A978ef53a95a2f391)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x742F0619adB993809B1B00E493b5bdb4085B735e)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xce4b9839C83cB0650B34659B8Fa44609A45b1010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xd76eb58D7fA80AC6119942bA20D9bbbA94Ce66BC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@287770865 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++----
 9 files changed, 3374 insertions(+), 1106 deletions(-)
```

Generated with discovered.json: 0xa2e2cb989ca62eb94d5220d5cb627e8dcd5adc55

# Diff at Tue, 06 May 2025 10:57:02 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 287770865
- current block number: 287770865

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    EOA  (0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xf3790933867e5d3721b57d0fe1395c4cc688c582

# Diff at Fri, 02 May 2025 17:25:17 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 287770865
- current block number: 287770865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xa6e4cea3738af03c71f5fde1dca9b0a301311166

# Diff at Tue, 29 Apr 2025 08:19:20 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 287770865
- current block number: 287770865

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"}]},{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"}]},{"permission":"validate","to":"0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
    }
```

Generated with discovered.json: 0x32faee5a48174c15b75f86ab6d0589e7ea95036d

# Diff at Thu, 06 Mar 2025 09:39:10 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 287770865
- current block number: 287770865

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

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

Generated with discovered.json: 0x071f5636191e3a9c9cf3f79a8cdaa0ba9c5de71f

# Diff at Tue, 04 Mar 2025 10:40:24 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 287770865
- current block number: 287770865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        151854509
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        151854509
    }
```

```diff
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        150598054
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      sinceBlock:
+        151854509
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        151854509
    }
```

```diff
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        150598355
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        150599283
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        151854509
    }
```

```diff
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        150598495
    }
```

```diff
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        150598644
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        151854509
    }
```

```diff
    contract CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        151869147
    }
```

```diff
    contract ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        151869147
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        151854509
    }
```

```diff
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        150598192
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        151854509
    }
```

```diff
    contract GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        151869147
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        151854509
    }
```

Generated with discovered.json: 0xe4001b65a027f70f385f73d4cad6689fa8860313

# Diff at Thu, 27 Feb 2025 11:47:23 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 287770865
- current block number: 287770865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1CustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

```diff
    contract ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0xb719c87e94ceabe57b9944ac5a66f36cc4ec0ddc

# Diff at Fri, 21 Feb 2025 14:12:25 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287770865
- current block number: 287770865

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

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
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
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
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
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
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x2a0ff611ff7eb622860af1e56e7b5972b72be8aa

# Diff at Thu, 20 Feb 2025 12:22:45 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 287770865
- current block number: 287770865

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xf3c72e562282f2f4696616af1861d98f836b9acb

# Diff at Tue, 04 Feb 2025 12:33:53 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287770865
- current block number: 287770865

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x851e7cf91aa65e708b7b932743d3e1ef4ef77e34

# Diff at Mon, 20 Jan 2025 11:10:29 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287770865
- current block number: 287770865

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      directlyReceivedPermissions.2.target:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
      directlyReceivedPermissions.2.from:
+        "0x846387C3D6001F74170455B1074D01f05eB3067a"
      directlyReceivedPermissions.1.target:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
      directlyReceivedPermissions.1.from:
+        "0x846387C3D6001F74170455B1074D01f05eB3067a"
      directlyReceivedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
      directlyReceivedPermissions.0.from:
+        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      directlyReceivedPermissions.9.from:
+        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      directlyReceivedPermissions.8.target:
-        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      directlyReceivedPermissions.8.from:
+        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      directlyReceivedPermissions.7.target:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      directlyReceivedPermissions.7.from:
+        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      directlyReceivedPermissions.6.target:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      directlyReceivedPermissions.6.from:
+        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      directlyReceivedPermissions.5.target:
-        "0xB155C77a440DA7c282993a89FeA609598293017A"
      directlyReceivedPermissions.5.from:
+        "0xB155C77a440DA7c282993a89FeA609598293017A"
      directlyReceivedPermissions.4.target:
-        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      directlyReceivedPermissions.4.from:
+        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      directlyReceivedPermissions.3.target:
-        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      directlyReceivedPermissions.3.from:
+        "0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"
      directlyReceivedPermissions.2.target:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      directlyReceivedPermissions.2.from:
+        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      directlyReceivedPermissions.1.target:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      directlyReceivedPermissions.1.from:
+        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      directlyReceivedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      directlyReceivedPermissions.0.from:
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
      issuedPermissions.2.to:
+        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.target:
-        "0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
      issuedPermissions.0.to:
+        "0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

Generated with discovered.json: 0xfc1c7e67bea91424d16cff666e61f66f5f43e7eb

# Diff at Wed, 08 Jan 2025 10:44:57 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287770865
- current block number: 287770865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770865 (main branch discovery), not current.

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xad887e3af4083012a21acc4c1a0c377db22d627a

# Diff at Mon, 23 Dec 2024 12:45:04 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 274077007
- current block number: 287770865

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274077007 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x74399c63d62cd12f44573cbb21594f22578a86a2

# Diff at Thu, 05 Dec 2024 11:56:28 GMT:

- chain: arbitrum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 274077007
- current block number: 274077007

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274077007 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x49e57a86c5635142dcd0a6ada840dd385a2e4e8f

# Diff at Fri, 29 Nov 2024 11:28:47 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 274077007
- current block number: 274077007

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274077007 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0xb75c99b64790d2cd3f60c710d8eeb75232803a27

# Diff at Fri, 15 Nov 2024 08:18:16 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 274077007
- current block number: 274077007

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274077007 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}]}
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
-        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.0:
+        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
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

Generated with discovered.json: 0x91f48f0dfec9adbaa5288b683f730626fda8246f

# Diff at Wed, 13 Nov 2024 15:24:06 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 269947184
- current block number: 274077007

## Description

Move to discoverydriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269947184 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
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
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
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
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        true
      values.dacKeyset:
+        {"requiredSignatures":0,"membersCount":0,"blsSignatures":[]}
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
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
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
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

Generated with discovered.json: 0x97965cbba2e42c4375e66782bdd075c787c004ae

# Diff at Mon, 04 Nov 2024 08:01:25 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 269947184
- current block number: 269947184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269947184 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x846387C3D6001F74170455B1074D01f05eB3067a"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c","via":[{"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
+        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
      issuedPermissions.2.via.0:
-        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.1.via.0:
+        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

Generated with discovered.json: 0x6660dec548dc5efdd73a072e6bdd44b2097c10bc

# Diff at Fri, 01 Nov 2024 14:55:04 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 267469917
- current block number: 269947184

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469917 (main branch discovery), not current.

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xd202c230b55617b045d2aff7aec69019563525ad

# Diff at Tue, 29 Oct 2024 13:21:58 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267469917
- current block number: 267469917

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469917 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x0c0ab305c7c1df6bdef13eeef1550943e5160c06

# Diff at Tue, 29 Oct 2024 08:08:30 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267469917
- current block number: 267469917

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469917 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0x846387C3D6001F74170455B1074D01f05eB3067a"},{"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0xB155C77a440DA7c282993a89FeA609598293017A","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0xe507b9EF563DB6CcFDcE270160C50b2005BeED20","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]},{"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x846387C3D6001F74170455B1074D01f05eB3067a"}
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.2.via.0:
+        {"address":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","delay":0}
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.1.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
      issuedPermissions.0.via.1:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

Generated with discovered.json: 0x1061d2b6bb19157e72808930c12d6d5d4899eca7

# Diff at Mon, 28 Oct 2024 14:06:58 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267469917
- current block number: 267469917

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469917 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"]
    }
```

Generated with discovered.json: 0xf9aec8095f939730e17fe32ddb40585bc85f485e

# Diff at Fri, 25 Oct 2024 09:58:32 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 257931565
- current block number: 267469917

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xe507b9EF563DB6CcFDcE270160C50b2005BeED20","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xB155C77a440DA7c282993a89FeA609598293017A","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x846387C3D6001F74170455B1074D01f05eB3067a"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","via":[{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]}
      receivedPermissions.0.target:
-        "0x846387C3D6001F74170455B1074D01f05eB3067a"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      receivedPermissions.0.via:
+        [{"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"}]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"},{"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834"},{"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"},{"permission":"upgrade","target":"0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"},{"permission":"upgrade","target":"0xB155C77a440DA7c282993a89FeA609598293017A"},{"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"},{"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"},{"permission":"upgrade","target":"0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"},{"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"},{"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"},{"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834"},{"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83"},{"permission":"upgrade","target":"0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"},{"permission":"upgrade","target":"0xB155C77a440DA7c282993a89FeA609598293017A"},{"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"},{"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"},{"permission":"upgrade","target":"0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"},{"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"}]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.1.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
      issuedPermissions.0.via.0:
+        {"address":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","delay":0}
    }
```

Generated with discovered.json: 0x066b93c300c70edbc22ce8b12816274c368849ed

# Diff at Wed, 23 Oct 2024 14:36:40 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 257931565
- current block number: 257931565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

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
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
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
+        "0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"
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
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
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

Generated with discovered.json: 0xd10198b330811844be689732610ad051e36114a0

# Diff at Mon, 21 Oct 2024 12:51:15 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 257931565
- current block number: 257931565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x74e5cfa9044df3e695d0c398ba196451fe0e2e81

# Diff at Mon, 21 Oct 2024 11:13:05 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 257931565
- current block number: 257931565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
      values.$pastUpgrades.0.1:
-        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
      values.$pastUpgrades.0.1:
-        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7785047A920B43d23D181C6E68fa9405c874997c"]
      values.$pastUpgrades.0.1:
-        ["0x7785047A920B43d23D181C6E68fa9405c874997c"]
+        "0x49196afe9792981c6f4b014481dba1633a2bd3ab8246a1cd4f0518856ecf829b"
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"]
      values.$pastUpgrades.0.1:
-        ["0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"]
+        "0x49196afe9792981c6f4b014481dba1633a2bd3ab8246a1cd4f0518856ecf829b"
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
      values.$pastUpgrades.0.1:
-        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2fB33D8e4a8E989E7814D914973096736ed718b5"]
      values.$pastUpgrades.0.1:
-        ["0x2fB33D8e4a8E989E7814D914973096736ed718b5"]
+        "0x49196afe9792981c6f4b014481dba1633a2bd3ab8246a1cd4f0518856ecf829b"
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
      values.$pastUpgrades.0.1:
-        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
+        "0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095"
    }
```

Generated with discovered.json: 0x6c9bd654098233de2b4f61326ff157fe8e2d525a

# Diff at Wed, 16 Oct 2024 11:43:57 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 257931565
- current block number: 257931565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0","via":[]}
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91"
+        "0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"
    }
```

Generated with discovered.json: 0xf8edfefe64ed95b3849ed7f59b6329eb6ea358b2

# Diff at Mon, 14 Oct 2024 10:58:38 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 257931565
- current block number: 257931565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
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
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
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
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
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
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x8d9e1660cd96605e8727f611f7b96ef82ad6cd8a76db94cd253b74cddd1c6bce"]
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
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
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

Generated with discovered.json: 0x891bbe5e65ababf5e14bd5d3cb1c9bd4d5c7c148

# Diff at Tue, 01 Oct 2024 11:12:35 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257931565
- current block number: 257931565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257931565 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]]]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0x09824fe72BFF474d16D9c2774432E381BBD60662"]]]
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T05:32:46.000Z",["0x7785047A920B43d23D181C6E68fa9405c874997c"]]]
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T05:32:46.000Z",["0xA8531c989b2f8531e123F1daf2edAe83bf4aa190"]]]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]]]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T05:32:46.000Z",["0x2fB33D8e4a8E989E7814D914973096736ed718b5"]]]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-19T04:23:39.000Z",["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]]]
    }
```

Generated with discovered.json: 0xca199f795d8e47869109877d321e5f15aca53206

# Diff at Fri, 27 Sep 2024 15:21:48 GMT:

- chain: arbitrum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 225980981
- current block number: 257931565

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x0e014aa77b3e98f0479abdfed43c504155a35197

# Diff at Sun, 01 Sep 2024 08:46:01 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "ArbOS v10.2 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x0a367281a971ad2dad1e3d1a464ffe45008cba3c

# Diff at Fri, 30 Aug 2024 08:06:07 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

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

Generated with discovered.json: 0x082a9dc9e95e59430bfdc0aab062be8c0bc2b95d

# Diff at Fri, 23 Aug 2024 09:57:01 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
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
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
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
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
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

Generated with discovered.json: 0x9e7e79dbcf4fc4ea17cca06cf332f58122be081e

# Diff at Wed, 21 Aug 2024 10:07:27 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x846387C3D6001F74170455B1074D01f05eB3067a"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x846387C3D6001F74170455B1074D01f05eB3067a","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xB155C77a440DA7c282993a89FeA609598293017A","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]},{"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","via":[]},{"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834","via":[]},{"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","via":[]},{"permission":"upgrade","target":"0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","via":[]},{"permission":"upgrade","target":"0xB155C77a440DA7c282993a89FeA609598293017A","via":[]},{"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","via":[]},{"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","via":[]},{"permission":"upgrade","target":"0xe507b9EF563DB6CcFDcE270160C50b2005BeED20","via":[]},{"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","via":[]}]
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
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]}]
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
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
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
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
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

Generated with discovered.json: 0x2aab07ef6adb3058696ac916f69da4793cd641b9

# Diff at Fri, 09 Aug 2024 12:03:33 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      assignedPermissions.upgrade.8:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      assignedPermissions.upgrade.7:
-        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      assignedPermissions.upgrade.6:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      assignedPermissions.upgrade.5:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      assignedPermissions.upgrade.4:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "0xB155C77a440DA7c282993a89FeA609598293017A"
      assignedPermissions.upgrade.2:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      assignedPermissions.upgrade.1:
-        "0xB155C77a440DA7c282993a89FeA609598293017A"
+        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      assignedPermissions.upgrade.0:
-        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

Generated with discovered.json: 0x448ab3892e6e2b00aa9721e63a903c212de796a4

# Diff at Fri, 09 Aug 2024 10:13:33 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x846387C3D6001F74170455B1074D01f05eB3067a"]
      assignedPermissions.upgrade:
+        ["0x846387C3D6001F74170455B1074D01f05eB3067a"]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xB155C77a440DA7c282993a89FeA609598293017A","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"]
      assignedPermissions.upgrade:
+        ["0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","0xB155C77a440DA7c282993a89FeA609598293017A","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xe507b9EF563DB6CcFDcE270160C50b2005BeED20","0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"]
    }
```

Generated with discovered.json: 0xf721fad0b314e573e4c0338c87ab1580d694b2c9

# Diff at Tue, 30 Jul 2024 11:17:08 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xac28f1bc3422f4ba43579353bad7acf4da24aa51

# Diff at Tue, 11 Jun 2024 12:06:41 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 215490223
- current block number: 220722589

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 215490223 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xe27c45aa1fa1e8e953b3fd2fd42d53e971cb449f

# Diff at Mon, 27 May 2024 07:16:25 GMT:

- chain: arbitrum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e3af44de7f5996e5fc7d7b401325abe876105664 block: 214125753
- current block number: 215490223

## Description

Back to the initial required stake of 0,1 ETH.

## Watched changes

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.currentRequiredStake:
-        "300000000000000000"
+        "100000000000000000"
    }
```

Generated with discovered.json: 0x13f3e1cccf1d53a54a60f806647a4ca27d876af9

# Diff at Thu, 23 May 2024 06:41:36 GMT:

- chain: arbitrum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@45012f9c9629c7256c2c901ee618dd1c18eaaafa block: 211900051
- current block number: 214125753

## Description

The required stake is raised from 0.1 to 0.3 ETH. There is only one whitelisted validator who has 0.1 stake and as not confirmed any node since May-21-2024 09:09:22 AM.

## Watched changes

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.currentRequiredStake:
-        "100000000000000000"

          100000000000000000
+        "300000000000000000"
    }
```

Generated with discovered.json: 0xefe932767cda34d32df48f810919d7198c6c2a82

# Diff at Wed, 31 Jan 2024 08:03:25 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 175727823
- current block number: 175989340

## Description

Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175727823 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      values.keySetUpdates:
+        0
    }
```

Generated with discovered.json: 0xceb17155dd0178eaeb49f0f0c13d6765f1491c4a

# Diff at Tue, 30 Jan 2024 13:08:11 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 173375251
- current block number: 175727823

## Description

Add the SequencerInboxVersion handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 173375251 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0xfea566360a1afd0474f5cc2e97609a3eb1dbaa61

# Diff at Tue, 23 Jan 2024 13:55:47 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 168378561
- current block number: 173375251

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 168378561 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      values.validators:
+        ["0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      values.batchPosters:
+        ["0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"]
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    }
```

# Diff at Mon, 08 Jan 2024 15:22:41 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3ee3c075ee99707d8392a73b092ed24eeb24866f block: 159392469
- current block number: 168378561

## Description

Executors and stake escrow contracts have been updated. At this point we're not displaying any info yet (ts is empty).

## Watched changes

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xD1C955A1544cF449F4a8463E9fE2AC4Ff0798E05"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      values.loserStakeEscrow:
-        "0xE6Deca8779AAd0F8C96Dd843F77BF2a55ea2F402"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 159392469 (main branch discovery), not current.

```diff
    contract Inbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      name:
-        "Inbox"
+        "SequencerInbox"
    }
```

# Diff at Tue, 12 Dec 2023 13:17:02 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    }
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    }
```

