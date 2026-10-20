Generated with discovered.json: 0x2adab79244a22c2cbe29b2db78bf01917f61477e

# Diff at Tue, 20 Oct 2026 09:05:15 GMT:

- id: 0bae0423
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1792013664

## Description

EigenDA's Ethereum contracts become a shared module: the canonical cert verifier router, its verifiers, the BLS signature verifier and the registries, discovered once and referenced by the L2s that verify EigenDA certificates. The entries below this one were carried over from the eigenda project, which held this discovery until #13122.

## Initial discovery

```diff
+   Status: CREATED
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D) [eigenlayer/StakeRegistry]
    +++ description: Keeps track of the total stake of each operator.
```

```diff
+   Status: CREATED
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505) [eigenlayer/BLSApkRegistry]
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
```

```diff
+   Status: CREATED
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) [eigenlayer/RegistryCoordinator]
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060) [eigenlayer/EigenDAPauserRegistry]
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
```

```diff
+   Status: CREATED
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E) [eigenlayer/EjectionManager]
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
```

```diff
+   Status: CREATED
    external contract AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDACertVerifierRouter (eth:0x1be7258230250Bc6a4548F8D59d576a87D216C12) [eigenda/EigenDACertVerifierRouter]
    +++ description: A router contract for DA Certificate verifiers. Verifier routing depends on the certificate reference block number.
```

```diff
+   Status: CREATED
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    external contract EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0x46766C6426eF4D3092f73F72660A8b7B510E6846) [eigenda/EigenDACertVerifier]
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
```

```diff
+   Status: CREATED
    external contract EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2) [eigenlayer/SocketRegistry]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0x61692e93b6B045c444e942A91EcD1527F23A3FB7) [eigenda/EigenDACertVerifier]
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
```

```diff
+   Status: CREATED
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad) [eigenlayer/EigenDADisperserRegistry]
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) [eigenlayer/EigenDAServiceManager]
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
```

```diff
+   Status: CREATED
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) [eigenlayer/PaymentVault]
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030) [eigenlayer/IndexRegistry]
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    external contract EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B) [eigenlayer/EigenDARelayRegistry]
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0xD2e690d08Db56Fb648B1340457281EDE7b6F53FE) [eigenda/EigenDACertVerifier]
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15) [eigenlayer/EigenDAThresholdRegistry]
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0xE1Ae45810A738F13e70Ac8966354d7D0feCF7BD6) [eigenda/EigenDACertVerifier_Legacy]
    +++ description: A legacy DACert verifier contract. It is used to verify v2 DA certificates. New verifiers should use the new verifier router contract.
```

```diff
+   Status: CREATED
    contract OperatorStateRetriever (eth:0xEC35aa6521d23479318104E10B4aA216DBBE63Ce) [eigenda/OperatorStateRetriever]
    +++ description: A contract for retrieving AVS operators state (e.g., quorum bitmaps, ordered operator lists, stakes, sockets, signatures indices—at) at a given block directly from on-chain registries.
```

```diff
+   Status: CREATED
    external contract (eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x2E158da11961426E2A1Cc9e79f40244486b6845C)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x347660a632B0Aac5B70dCd5e6C3444a7C933a137)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x45dcD05251F3327EcCd4766a9264DBDAab3A4065)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x57af860e3a1C16641CDDDa92898266D2df7Dfa71)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x7474E1D80E844e6EdB430841DeEF702a6B747863)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0x9b2C61521AF4AB9f4BE25297838F72a56462B578)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```

```diff
+   Status: CREATED
    external contract (eth:0xfD636E8EB3839cE82A58936b795043Da7DB0c734)
    +++ description: None
```
