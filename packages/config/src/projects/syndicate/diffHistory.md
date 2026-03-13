Generated with discovered.json: 0xf3a7f8351eadbaf7dfe531be57ecd366197dd9da

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
