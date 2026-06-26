Generated with discovered.json: 0xabbdd3058934b5b617ebb92e48f5bd736795ad95

# Diff at Tue, 16 Jun 2026 07:37:01 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@254df558db0f4fcb5b0e269facd77fad1c7d2ddb block: 1775599220
## Description

SequencerInbox `maxTimeVariation` delay fields increased 10x, weakening force inclusion from 4d to 40d.

## Watched changes

```diff
    contract SequencerInbox (eth:0x12ad349e5d72B582856290736e0f13FE5fA57Aa4) [N/A] {
    +++ description: None
      values.maxTimeVariation.0:
-        28800
+        288000
      values.maxTimeVariation.2:
-        345600
+        3456000
    }
```

Generated with discovered.json: 0x31223a8558a29070654ed5e81cb671858de0e52d

# Diff at Fri, 12 Jun 2026 10:19:05 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1775599220
- current timestamp: 1775599220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775599220 (main branch discovery), not current.

```diff
    EOA  (eth:0x85C2AE9B88baDf751228e307Ae9ab76B74d84f5c) {
    +++ description: None
      eoaWithUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC) {
    +++ description: None
      eoaWithUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x30b91654787143769d952dfba05230004d2948c0

# Diff at Tue, 09 Jun 2026 12:43:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1775599220
- current timestamp: 1775599220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775599220 (main branch discovery), not current.

```diff
    EOA  (eth:0x54dD1659c232DEC31386C52507982a4983D9BCb8) {
    +++ description: None
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (eth:0xb501068Ee205c6A9Eb2974B7D6459bcb3B7514A2) {
    +++ description: None
      receivedPermissions.0.permission:
-        "validate"
+        "interact"
    }
```

```diff
    EOA  (eth:0xe8437B66E834B7CdC90cC5D98B8DD6e636b37D7a) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can store and serve both unencoded blobs as well as encoded chunks."
      receivedPermissions.0.permission:
-        "relayDA"
+        "interact"
    }
```

```diff
    EOA  (eth:0xF3d7C0D52fF8f4CF74A3CD9C53778516f4235bE9) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can disperse EigenDA blobs to the EigenDA node operators."
      receivedPermissions.0.permission:
-        "disperse"
+        "interact"
    }
```

Generated with discovered.json: 0xf0225a32059b00f3028a5b8de444e869e090c56f

# Diff at Fri, 15 May 2026 12:37:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1775599220
- current timestamp: 1775599220

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775599220 (main branch discovery), not current.

```diff
    contract OneStepProver0 (eth:0x2420b6bF83B8fEEab576F2f3e5B5d130F2376b2F) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
+        "0x063a1b3c4451e69f827acd833c42e986c2c617bfaabb13884fb438185b192407"
    }
```

```diff
    contract OneStepProverMemory (eth:0x27CD0B994cc40a74962Db2fA6b973bf7d19f6Ec6) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
+        "0x9e22e05e7953684e6f00507684bb902908d6d4383b2e82ecdce789027bebc33a"
    }
```

```diff
    contract OneStepProverHostIo (eth:0x6D25E739016f42B70885E63629C7356C2E29a2D7) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x90744f5ef4ff8b3eef422b08ec15bbdb0aefe2599d0d0cd4010c7f35b05ef145"
+        "0x9eae78e35e5c868cd5e3de5bdfb2bef13871657ad2b01fbdf5f384035290f16f"
    }
```

```diff
    contract OneStepProofEntry (eth:0xa8aA9784FA7eC40Dc81d298130746c2FA4785EC8) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
+        "0x294155e99018f1d390be420f29ef940f9843f3ce54ed4e515d998653e2ce4293"
    }
```

```diff
    contract ChallengeManager (eth:0xABf2988264170a7f94E6Fa76ECA5965B906E229d) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
+        "0x1eba00857f5477dbcd075b48ce8af9c74d5cb4f93a5e714dd27b3df498737e54"
    }
```

Generated with discovered.json: 0x6307509651ef5204268f28a9a4f47915ab070b7d

# Diff at Fri, 08 May 2026 07:52:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1775599220
- current timestamp: 1775599220

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775599220 (main branch discovery), not current.

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D) [eigenlayer/StakeRegistry] {
    +++ description: Keeps track of the total stake of each operator.
      sourceHashes.1:
-        "0x249715f12cf118070103f30534be5816b6847d0b1cd8fe8cae8e1833c6afd1f8"
+        "0x2164f0da2cf46f7b500efb558c3a6a0afe65e67d6534370fadf7dce65389b81f"
    }
```

```diff
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505) [eigenlayer/BLSApkRegistry] {
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
      sourceHashes.1:
-        "0xb4ca65ab7fb0cd9a8fd6f0c4b7805ea96914dcb6dd65309b2557931358ad1ff3"
+        "0x913bc45c379cd6b9d480abbe939324e96f3330645202dd152a4c6532f69ad73e"
    }
```

```diff
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) [eigenlayer/RegistryCoordinator] {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
      sourceHashes.1:
-        "0x7e7c9cae80b660c369700ce034c417e93999b08e43dabd1c37a1e76599552575"
+        "0x7bc3d6a892a6e8c6ec410ff8d531b91cca1a03c0c06abc1963b402fd63287f38"
    }
```

```diff
    contract SequencerInbox (eth:0x12ad349e5d72B582856290736e0f13FE5fA57Aa4) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0x8b058ac51e60b9b13d66835c5cd304f78a34f7b576808d2f641873a98ea21a87"
+        "0xbf8202d6cf3f8f8ecd1f365ee6bc948c2354d11ccfc8538f4ca670380f789b54"
    }
```

```diff
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E) [eigenlayer/EjectionManager] {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
      sourceHashes.1:
-        "0x94a826fe3f9609e445cfd3cd6d7d9709c559367e9cb49a9b6d7952cd3a116cd0"
+        "0x479a55e20f8ffd16dffa5952f97f6abd15293e57871ef06140a12860676d5327"
    }
```

```diff
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract Syndicate Token (eth:0x1bAB804803159aD84b8854581AA53AC72455614E) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x01e7227f08c10c20c7ac43ead2586d4a8fcaeeb008094f59bf2df8a3f1de84e8"
+        "0x3fd5da8591cf0e9400bf9a2d09758a9b9659709af9292b8c8e165ae71e6e9fe8"
    }
```

```diff
    contract OneStepProver0 (eth:0x2420b6bF83B8fEEab576F2f3e5B5d130F2376b2F) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x642d283934aef1189cf62e1bcd34a5081762b33fdd3ec8e823f304f874e48748"
+        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
    }
```

```diff
    contract OneStepProverMemory (eth:0x27CD0B994cc40a74962Db2fA6b973bf7d19f6Ec6) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"
+        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
    }
```

```diff
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract Bridge (eth:0x3C8cF0ae6E89AC0796f29B3a58e7dEa1cD072277) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0xeb6629eb5b0255b6d37e8514ff21605e477c00ea6f9347398ae6f4d58401d763"
+        "0x81676303b84a5540985e44d8d99c950b1846a525f79914c75e45000eb9a0d62b"
    }
```

```diff
    contract GatewayRouter (eth:0x534Eb1F79C8df3aB1E507e408EeF4e99D53A1239) [orbitstack/GatewayRouter] {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sourceHashes.1:
-        "0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"
+        "0xf536eecfe8b70bf9ba1ea603efcc5ee20c36b0413e4e5258494893cbde454898"
    }
```

```diff
    contract Inbox (eth:0x5EA55Fd41D42Eb307D281bdE78E4e7572A35ea13) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x82dad78abdf27e168de1ae177b8055db4167106d71273d9a3264e9898a6055e4"
+        "0x03939c3cbd6c108ea9a077f61bb7ec6c3254fe21911bf5dfdb3c0efcb636e796"
    }
```

```diff
    contract ERC20Gateway (eth:0x6CA109706c6EBe5379c45f20B3311441D50cb711) [orbitstack/ERC20Gateway] {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sourceHashes.1:
-        "0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"
+        "0xe51bf51c986c2124e5af39cc6e16ee63de27ee0cfa9b73dc4b10c49a4d994d2f"
    }
```

```diff
    contract OneStepProverHostIo (eth:0x6D25E739016f42B70885E63629C7356C2E29a2D7) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xa96d268716db422885c219b57cd6f4999103426af695737627f4e8f151a02296"
+        "0x90744f5ef4ff8b3eef422b08ec15bbdb0aefe2599d0d0cd4010c7f35b05ef145"
    }
```

```diff
    contract OneStepProverMath (eth:0x78471572Be99D99f9CE5867B208F15A75F074235) [orbitstack/OneStepProverMath] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3de1ddc210fe283d7298c5f06879df577c6a475329a206b1928c74d10db656d5"
+        "0xd38b92884347e76d4ce463bc343cbf508eefb150146ed51cb80c2aee8c565122"
    }
```

```diff
    contract EigenDACertVerifier (eth:0x787c88E70900f6AE10E7B9D18024482895EBD1eb) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x300b2bdf5252acff068ab2be85908f10cfd2b12b81b54cf600004b42c93a1ca0"
+        "0xde47e9312f2945cd5055472f18bc58ea27c5fa575460d4841b2fcfd8a6345ed7"
    }
```

```diff
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad) [eigenlayer/EigenDADisperserRegistry] {
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
      sourceHashes.1:
-        "0x8d337ccea9456dccbcd3d6b82ca9d61509d3a9343487e057438b300efe5484c6"
+        "0xd6d45d6bf7a42c401e94bff9aa98b523d14e47e6c91ec9e5aef48ddea6e75a78"
    }
```

```diff
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) [eigenlayer/EigenDAServiceManager] {
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
      sourceHashes.1:
-        "0x41471c5c89db3f645030775d3f3cc317047a179f36469fbd736db24baed6523e"
+        "0x5446a295966c1f9d773b7b50883f2d7b4890b72f6a5dd66926209ab6ac919a59"
    }
```

```diff
    contract Alchemy Multisig 1 (eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract OneStepProofEntry (eth:0xa8aA9784FA7eC40Dc81d298130746c2FA4785EC8) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x96f85480073b58d0e985cd6c68956f4a52f5ed8b2ce751b18868e2e830be3678"
+        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
    }
```

```diff
    contract ValidatorUtils (eth:0xAa1EaB2ea108FDbCABd760a37E0B06f6e1dA8cC0) [orbitstack/ValidatorUtils] {
    +++ description: This contract implements view only utilities for validators.
      sourceHashes.0:
-        "0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"
+        "0xebcd95194086ae9c3b9095578172a3192d9d209e5b159956f1d266910d248334"
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xab26536B7CaA4928708152272967FF1B32Fbf96a) [eigenlayer/EigenDAThresholdRegistry] {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      sourceHashes.1:
-        "0x7de6bfaca27d4a2d2ff694543af488ed523e89a1f239036f972852611a228eae"
+        "0x77e829aa26d5459004c4d89d84d90fcc1876ecabc83130235db2c3a71f56b66f"
    }
```

```diff
    contract ChallengeManager (eth:0xABf2988264170a7f94E6Fa76ECA5965B906E229d) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
+        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
    }
```

```diff
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) [eigenlayer/PaymentVault] {
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
      sourceHashes.1:
-        "0xf39de15799feffaa8711b3b5e9ff8fb4c66ef1cbac1fe00cc984f957663d73d1"
+        "0x198f5fd7944b62838fac91becbbf3cdb3aadaa098b9d64c37eccbabf33318378"
    }
```

```diff
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B) [eigenlayer/EigenDARelayRegistry] {
    +++ description: Registry for EigenDA relay keys, maps key to address.
      sourceHashes.1:
-        "0x2a5d28cd901637b2eed614152fc63ba60a2a5e10127efe030849aec4cfe64007"
+        "0x04415dba9be0ddc638a871b192f3a780b709a0841a143c08085a9f4ac1372040"
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15) [eigenlayer/EigenDAThresholdRegistry] {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      sourceHashes.1:
-        "0x7de6bfaca27d4a2d2ff694543af488ed523e89a1f239036f972852611a228eae"
+        "0x77e829aa26d5459004c4d89d84d90fcc1876ecabc83130235db2c3a71f56b66f"
    }
```

```diff
    contract Outbox (eth:0xf555Bc86D1C953414F676479Bf7C979b1A737E8C) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0xfc1c087eedce3e4be0593d2e01fcd357b4980c69e03399574b4606e4f3b9ee04"
+        "0xb9f7bc73978fab23b0df754fac230d706fee0d774d97b8533b62b3014d5561a8"
    }
```

```diff
    contract UpgradeExecutor (eth:0xFA4d1D308f4B4f6E6F836Db2B77Db549606A460c) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
    }
```

Generated with discovered.json: 0x9633768731de7da41f7e6ec1498979b61beb9057

# Diff at Tue, 05 May 2026 10:23:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1775599220
- current timestamp: 1775599220

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775599220 (main branch discovery), not current.

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) {
    +++ description: None
      deployerAddress:
+        "eth:0x5D9A6573206e5205702E4caD87DC61f4C2a1Ad04"
    }
```

```diff
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D) {
    +++ description: Keeps track of the total stake of each operator.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505) {
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060) {
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
      deployerAddress:
+        "eth:0x4eF221F76F046f3cFA3f739c9dcD368D59df99DA"
    }
```

```diff
    contract SequencerInbox (eth:0x12ad349e5d72B582856290736e0f13FE5fA57Aa4) {
    +++ description: None
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E) {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) {
    +++ description: None
      deployerAddress:
+        "eth:0x2bBA03bA38D90634e6afD8C23C16ca01651bc493"
    }
```

```diff
    contract Syndicate Token (eth:0x1bAB804803159aD84b8854581AA53AC72455614E) {
    +++ description: None
      deployerAddress:
+        "eth:0x2455166e3aed0cc3A9D1C3774Bf1B24A31554025"
    }
```

```diff
    contract OneStepProver0 (eth:0x2420b6bF83B8fEEab576F2f3e5B5d130F2376b2F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x5a4aB7307C4480d64eF06F49d65666d9EFe99BC9"
    }
```

```diff
    contract OneStepProverMemory (eth:0x27CD0B994cc40a74962Db2fA6b973bf7d19f6Ec6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x5a4aB7307C4480d64eF06F49d65666d9EFe99BC9"
    }
```

```diff
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34) {
    +++ description: None
      deployerAddress:
+        "eth:0x34D64c402cA43C1c4B368e16130C64aC245718C6"
    }
```

```diff
    contract Bridge (eth:0x3C8cF0ae6E89AC0796f29B3a58e7dEa1cD072277) {
    +++ description: None
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract RollupProxy (eth:0x451bD7813909B899DA6EbEC55E8fF823c057e14A) {
    +++ description: None
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract  (eth:0x481D290473e4f6929AA45CFb7Ef7c7847aBeD007) {
    +++ description: None
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract GatewayRouter (eth:0x534Eb1F79C8df3aB1E507e408EeF4e99D53A1239) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2) {
    +++ description: None
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract Inbox (eth:0x5EA55Fd41D42Eb307D281bdE78E4e7572A35ea13) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract ERC20Gateway (eth:0x6CA109706c6EBe5379c45f20B3311441D50cb711) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract OneStepProverHostIo (eth:0x6D25E739016f42B70885E63629C7356C2E29a2D7) {
    +++ description: None
      deployerAddress:
+        "eth:0x5a4aB7307C4480d64eF06F49d65666d9EFe99BC9"
    }
```

```diff
    contract OneStepProverMath (eth:0x78471572Be99D99f9CE5867B208F15A75F074235) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x5a4aB7307C4480d64eF06F49d65666d9EFe99BC9"
    }
```

```diff
    contract EigenDACertVerifier (eth:0x787c88E70900f6AE10E7B9D18024482895EBD1eb) {
    +++ description: None
      deployerAddress:
+        "eth:0x85C2AE9B88baDf751228e307Ae9ab76B74d84f5c"
    }
```

```diff
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad) {
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract ProxyAdmin (eth:0x817BE2d0f28b594D7023dAdf2b3Aa54327180c66) {
    +++ description: None
      deployerAddress:
+        "eth:0x85C2AE9B88baDf751228e307Ae9ab76B74d84f5c"
    }
```

```diff
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99) {
    +++ description: None
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract RollupEventInbox (eth:0x82E761873714cDe47C594aA6F23E6b1844CD98dB) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract Alchemy Multisig 1 (eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      deployerAddress:
+        "eth:0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
    }
```

```diff
    contract OneStepProofEntry (eth:0xa8aA9784FA7eC40Dc81d298130746c2FA4785EC8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x5a4aB7307C4480d64eF06F49d65666d9EFe99BC9"
    }
```

```diff
    contract ValidatorUtils (eth:0xAa1EaB2ea108FDbCABd760a37E0B06f6e1dA8cC0) {
    +++ description: This contract implements view only utilities for validators.
      deployerAddress:
+        "eth:0x5a4aB7307C4480d64eF06F49d65666d9EFe99BC9"
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xab26536B7CaA4928708152272967FF1B32Fbf96a) {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      deployerAddress:
+        "eth:0x85C2AE9B88baDf751228e307Ae9ab76B74d84f5c"
    }
```

```diff
    contract ChallengeManager (eth:0xABf2988264170a7f94E6Fa76ECA5965B906E229d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) {
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030) {
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B) {
    +++ description: Registry for EigenDA relay keys, maps key to address.
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15) {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract Outbox (eth:0xf555Bc86D1C953414F676479Bf7C979b1A737E8C) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

```diff
    contract UpgradeExecutor (eth:0xFA4d1D308f4B4f6E6F836Db2B77Db549606A460c) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "eth:0x9A64b61bdfb2375d43A90e7BbF09EFe18bd6CADC"
    }
```

Generated with discovered.json: 0xf1ee73e827c7d5ec8e30cd92fef45e44ca8ee26f

# Diff at Tue, 07 Apr 2026 22:03:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@0abb07b4e46d76d6e92ec02beaddc56264e90c1e block: 1775083700
- current timestamp: 1775599220

## Description

EigenDAOperationsMultisig member removed (0x4985...), threshold unchanged at 3, now 3-of-4 (75%) instead of 3-of-5 (60%). Shared contract with eigenda/megaeth.

## Watched changes

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) {
    +++ description: None
      values.$members.1:
-        "eth:0x4985238672d91Baed43dF1B2431F67bc332A1753"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x0b8e30dbd325ec5e95907644b0dbaa8fc9fc3c03

# Diff at Fri, 13 Mar 2026 16:32:38 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1773419488

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D)
    +++ description: Keeps track of the total stake of each operator.
```

```diff
+   Status: CREATED
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505)
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
```

```diff
+   Status: CREATED
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656)
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0x12ad349e5d72B582856290736e0f13FE5fA57Aa4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
```

```diff
+   Status: CREATED
    reference AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Syndicate Token (eth:0x1bAB804803159aD84b8854581AA53AC72455614E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x2420b6bF83B8fEEab576F2f3e5B5d130F2376b2F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x27CD0B994cc40a74962Db2fA6b973bf7d19f6Ec6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    reference DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (eth:0x3C8cF0ae6E89AC0796f29B3a58e7dEa1cD072277)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x451bD7813909B899DA6EbEC55E8fF823c057e14A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x481D290473e4f6929AA45CFb7Ef7c7847aBeD007)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GatewayRouter (eth:0x534Eb1F79C8df3aB1E507e408EeF4e99D53A1239)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x5EA55Fd41D42Eb307D281bdE78E4e7572A35ea13)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (eth:0x6CA109706c6EBe5379c45f20B3311441D50cb711)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0x6D25E739016f42B70885E63629C7356C2E29a2D7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0x78471572Be99D99f9CE5867B208F15A75F074235)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0x787c88E70900f6AE10E7B9D18024482895EBD1eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad)
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x817BE2d0f28b594D7023dAdf2b3Aa54327180c66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0x82E761873714cDe47C594aA6F23E6b1844CD98dB)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
```

```diff
+   Status: CREATED
    contract Alchemy Multisig 1 (eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0xa8aA9784FA7eC40Dc81d298130746c2FA4785EC8)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (eth:0xAa1EaB2ea108FDbCABd760a37E0B06f6e1dA8cC0)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xab26536B7CaA4928708152272967FF1B32Fbf96a)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

```diff
+   Status: CREATED
    contract ChallengeManager (eth:0xABf2988264170a7f94E6Fa76ECA5965B906E229d)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05)
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    reference EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B)
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xf555Bc86D1C953414F676479Bf7C979b1A737E8C)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0xFA4d1D308f4B4f6E6F836Db2B77Db549606A460c)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```
