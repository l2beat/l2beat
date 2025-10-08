Generated with discovered.json: 0x9ecd307004856831c5b98e58daaf5aafbd223ed0

# Diff at Fri, 03 Oct 2025 08:43:32 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1757943756
- current timestamp: 1759480939

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x1b76e929ba29c73e93d1473cc5a6bba9b85f4558

# Diff at Fri, 26 Sep 2025 13:07:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1757943756
- current timestamp: 1757943756

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757943756 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x35330a6ce6a601ca56ef0a3181869de2acb600ef

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xf597ebd995438b34d62280db01e2b074e811e08a

# Diff at Tue, 26 Aug 2025 13:31:59 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755009465
- current timestamp: 1756214657

## Description

Conduit msig: removed one address

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0xd5b7229f2da21312b67d439ffda88ea481d20289

# Diff at Tue, 12 Aug 2025 14:42:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1752237035
- current timestamp: 1755009465

## Description

Conduit Multisig 1 signer added.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x7ee885d5ec4ef888a2c0a973af3399196eb50175

# Diff at Mon, 14 Jul 2025 12:45:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895948
- current block number: 22895948

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895948 (main branch discovery), not current.

```diff
    EOA  (0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7) {
    +++ description: None
      address:
-        "0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7"
+        "eth:0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7"
    }
```

```diff
    contract OneStepProofEntry (0x0537c93dA3b1f8A525204165d1d93De0534c262f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0537c93dA3b1f8A525204165d1d93De0534c262f"
+        "eth:0x0537c93dA3b1f8A525204165d1d93De0534c262f"
      values.prover0:
-        "0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482"
+        "eth:0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482"
      values.proverHostIo:
-        "0x856EA788977Bc771E8Ca87471baeC507A0f54771"
+        "eth:0x856EA788977Bc771E8Ca87471baeC507A0f54771"
      values.proverMath:
-        "0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5"
+        "eth:0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5"
      values.proverMem:
-        "0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe"
+        "eth:0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe"
      implementationNames.0x0537c93dA3b1f8A525204165d1d93De0534c262f:
-        "OneStepProofEntry"
      implementationNames.eth:0x0537c93dA3b1f8A525204165d1d93De0534c262f:
+        "OneStepProofEntry"
    }
```

```diff
    EOA  (0x11f563dDbF266484Dd910A401A7e44299d80b1d5) {
    +++ description: None
      address:
-        "0x11f563dDbF266484Dd910A401A7e44299d80b1d5"
+        "eth:0x11f563dDbF266484Dd910A401A7e44299d80b1d5"
    }
```

```diff
    EOA  (0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03) {
    +++ description: None
      address:
-        "0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03"
+        "eth:0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03"
    }
```

```diff
    contract GatewayRouter (0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
+        "eth:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.$pastUpgrades.0.2.0:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.counterpartGateway:
-        "0xEFE6F45507C24Bb85Fa25d417fe7d43763b9dE3d"
+        "eth:0xEFE6F45507C24Bb85Fa25d417fe7d43763b9dE3d"
      values.defaultGateway:
-        "0xE2C902BC61296531e556962ffC81A082b82f5F28"
+        "eth:0xE2C902BC61296531e556962ffC81A082b82f5F28"
      values.inbox:
-        "0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
      values.owner:
-        "0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
-        "L1OrbitGatewayRouter"
      implementationNames.eth:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
+        "L1OrbitGatewayRouter"
    }
```

```diff
    EOA  (0x17F187D978664C96ffD655996a45e085c403AD8b) {
    +++ description: None
      address:
-        "0x17F187D978664C96ffD655996a45e085c403AD8b"
+        "eth:0x17F187D978664C96ffD655996a45e085c403AD8b"
    }
```

```diff
    EOA  (0x2E8C0869C173cC07c58186E9DeEA74314635b1E2) {
    +++ description: None
      address:
-        "0x2E8C0869C173cC07c58186E9DeEA74314635b1E2"
+        "eth:0x2E8C0869C173cC07c58186E9DeEA74314635b1E2"
    }
```

```diff
    EOA  (0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779) {
    +++ description: None
      address:
-        "0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779"
+        "eth:0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779"
    }
```

```diff
    contract Bridge (0x35381f63091926750F43b2A7401B083263aDEF83) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0xd7FD189F1652378f32dA3db7926e51a7b0344797"
+        "eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797"
      values.$pastUpgrades.0.2.0:
-        "0xd7FD189F1652378f32dA3db7926e51a7b0344797"
+        "eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "eth:0xf576102530749344D2f4C04D15C2B8609c7897ea"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+        "eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "eth:0xf576102530749344D2f4C04D15C2B8609c7897ea"
      values.nativeToken:
-        "0x4C1746A800D224393fE2470C70A35717eD4eA5F1"
+        "eth:0x4C1746A800D224393fE2470C70A35717eD4eA5F1"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+        "eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
      values.rollup:
-        "0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      values.sequencerInbox:
-        "0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      implementationNames.0x35381f63091926750F43b2A7401B083263aDEF83:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd7FD189F1652378f32dA3db7926e51a7b0344797:
-        "ERC20Bridge"
      implementationNames.eth:0x35381f63091926750F43b2A7401B083263aDEF83:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797:
+        "ERC20Bridge"
    }
```

```diff
    contract RollupProxy (0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      values.$admin:
-        "0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      values.$implementation.0:
-        "0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
+        "eth:0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
      values.$implementation.1:
-        "0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
+        "eth:0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
      values.$pastUpgrades.0.2.0:
-        "0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
+        "eth:0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
      values.$pastUpgrades.0.2.1:
-        "0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
+        "eth:0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.challengeManager:
-        "0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
+        "eth:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
      values.inbox:
-        "0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+        "eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
      values.owner:
-        "0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      values.rollupEventInbox:
-        "0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "eth:0xf576102530749344D2f4C04D15C2B8609c7897ea"
      values.sequencerInbox:
-        "0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7"
+        "eth:0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7"
      values.validators.1:
-        "0x11f563dDbF266484Dd910A401A7e44299d80b1d5"
+        "eth:0x11f563dDbF266484Dd910A401A7e44299d80b1d5"
      values.validators.2:
-        "0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03"
+        "eth:0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03"
      values.validators.3:
-        "0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779"
+        "eth:0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779"
      values.validators.4:
-        "0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf"
+        "eth:0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf"
      values.validators.5:
-        "0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C"
+        "eth:0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C"
      values.validators.6:
-        "0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66"
+        "eth:0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66"
      values.validators.7:
-        "0xa017149a752BDd8723a09Cd6f40c388D38B8d202"
+        "eth:0xa017149a752BDd8723a09Cd6f40c388D38B8d202"
      values.validators.8:
-        "0xd1e56283216127E1F40A3752735C94A13d97bc92"
+        "eth:0xd1e56283216127E1F40A3752735C94A13d97bc92"
      values.validatorUtils:
-        "0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
+        "eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
      values.validatorWalletCreator:
-        "0x0A5eC2286bB15893d5b8f320aAbc823B2186BA09"
+        "eth:0x0A5eC2286bB15893d5b8f320aAbc823B2186BA09"
      implementationNames.0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC:
-        "RollupProxy"
      implementationNames.0x431cEb4EC80752304E7f19E72eb599074Cf5A202:
-        "RollupAdminLogic"
      implementationNames.0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54:
-        "RollupUserLogic"
      implementationNames.eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC:
+        "RollupProxy"
      implementationNames.eth:0x431cEb4EC80752304E7f19E72eb599074Cf5A202:
+        "RollupAdminLogic"
      implementationNames.eth:0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54:
+        "RollupUserLogic"
    }
```

```diff
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    EOA  (0x3955A911411cfae01c8B6Fd0D57c08DfE4428e38) {
    +++ description: None
      address:
-        "0x3955A911411cfae01c8B6Fd0D57c08DfE4428e38"
+        "eth:0x3955A911411cfae01c8B6Fd0D57c08DfE4428e38"
    }
```

```diff
    EOA  (0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf) {
    +++ description: None
      address:
-        "0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf"
+        "eth:0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      address:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.5:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.9:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.10:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      implementationNames.0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    EOA  (0x4ed0f98FB4c331e672653E832c55E0f9F402C228) {
    +++ description: None
      address:
-        "0x4ed0f98FB4c331e672653E832c55E0f9F402C228"
+        "eth:0x4ed0f98FB4c331e672653E832c55E0f9F402C228"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
    }
```

```diff
    contract OneStepProver0 (0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482"
+        "eth:0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482"
      implementationNames.0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482:
-        "OneStepProver0"
      implementationNames.eth:0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C) {
    +++ description: None
      address:
-        "0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C"
+        "eth:0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C"
    }
```

```diff
    contract Outbox (0x7e4627bC114Fcd12ba912103279FD2858E644E71) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+        "eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
+        "eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
      values.$pastUpgrades.0.2.0:
-        "0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
+        "eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
      values.bridge:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      implementationNames.0x7e4627bC114Fcd12ba912103279FD2858E644E71:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1f24EDD5161f82588007f33B72b0b28e46cCE878:
-        "ERC20Outbox"
      implementationNames.eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
+        "eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
      implementationNames.0x84eA2523b271029FFAeB58fc6E6F1435a280db44:
-        "ValidatorUtils"
      implementationNames.eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProverHostIo (0x856EA788977Bc771E8Ca87471baeC507A0f54771) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) as source of truth for the DA referenced by the fault proof.
      address:
-        "0x856EA788977Bc771E8Ca87471baeC507A0f54771"
+        "eth:0x856EA788977Bc771E8Ca87471baeC507A0f54771"
      description:
-        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) as source of truth for the DA referenced by the fault proof."
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) as source of truth for the DA referenced by the fault proof."
      values.BLOBSTREAM:
-        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
+        "eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      implementationNames.0x856EA788977Bc771E8Ca87471baeC507A0f54771:
-        "OneStepProverHostIo"
      implementationNames.eth:0x856EA788977Bc771E8Ca87471baeC507A0f54771:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D) {
    +++ description: None
      address:
-        "0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D"
+        "eth:0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D"
    }
```

```diff
    contract SequencerInbox (0x85eC1b9138a8b9659A51e2b51bb0861901040b59) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0xC1fB0cCa6e751dEe25e3D537D309d336E8304d50"
+        "eth:0xC1fB0cCa6e751dEe25e3D537D309d336E8304d50"
      values.$pastUpgrades.0.2.0:
-        "0x46FaF6838Bbf770986f073348D41881D5e54Fb0F"
+        "eth:0x46FaF6838Bbf770986f073348D41881D5e54Fb0F"
      values.$pastUpgrades.1.2.0:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.2.2.0:
-        "0xC1fB0cCa6e751dEe25e3D537D309d336E8304d50"
+        "eth:0xC1fB0cCa6e751dEe25e3D537D309d336E8304d50"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x17F187D978664C96ffD655996a45e085c403AD8b"
+        "eth:0x17F187D978664C96ffD655996a45e085c403AD8b"
      values.batchPosters.1:
-        "0x2E8C0869C173cC07c58186E9DeEA74314635b1E2"
+        "eth:0x2E8C0869C173cC07c58186E9DeEA74314635b1E2"
      values.batchPosters.2:
-        "0x4ed0f98FB4c331e672653E832c55E0f9F402C228"
+        "eth:0x4ed0f98FB4c331e672653E832c55E0f9F402C228"
      values.batchPosters.3:
-        "0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C"
+        "eth:0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C"
      values.batchPosters.4:
-        "0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D"
+        "eth:0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D"
      values.batchPosters.5:
-        "0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe"
+        "eth:0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe"
      values.batchPosters.6:
-        "0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e"
+        "eth:0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e"
      values.batchPosters.7:
-        "0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e"
+        "eth:0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e"
      values.batchPosters.8:
-        "0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36"
+        "eth:0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36"
      values.bridge:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.reader4844:
-        "0x58f9a83EF35a241bcAc7EC4fB6e7DBcE2A1D1125"
+        "eth:0x58f9a83EF35a241bcAc7EC4fB6e7DBcE2A1D1125"
      values.rollup:
-        "0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      implementationNames.0x85eC1b9138a8b9659A51e2b51bb0861901040b59:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC1fB0cCa6e751dEe25e3D537D309d336E8304d50:
-        "SequencerInbox"
      implementationNames.eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xC1fB0cCa6e751dEe25e3D537D309d336E8304d50:
+        "SequencerInbox"
    }
```

```diff
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    contract ChallengeManager (0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
+        "eth:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0x531c78AA0e0126Cef52c2027AA026Aa6e2929194"
+        "eth:0x531c78AA0e0126Cef52c2027AA026Aa6e2929194"
      values.$pastUpgrades.0.2.0:
-        "0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38"
+        "eth:0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38"
      values.$pastUpgrades.1.2.0:
-        "0x531c78AA0e0126Cef52c2027AA026Aa6e2929194"
+        "eth:0x531c78AA0e0126Cef52c2027AA026Aa6e2929194"
      values.bridge:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.osp:
-        "0x0537c93dA3b1f8A525204165d1d93De0534c262f"
+        "eth:0x0537c93dA3b1f8A525204165d1d93De0534c262f"
      values.resultReceiver:
-        "0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      values.sequencerInbox:
-        "0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      implementationNames.0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6:
-        "TransparentUpgradeableProxy"
      implementationNames.0x531c78AA0e0126Cef52c2027AA026Aa6e2929194:
-        "ChallengeManager"
      implementationNames.eth:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x531c78AA0e0126Cef52c2027AA026Aa6e2929194:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C) {
    +++ description: None
      address:
-        "0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C"
+        "eth:0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C"
    }
```

```diff
    contract Inbox (0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0x81eEEbb902693A3a90948Fe0A661aedb35271054"
+        "eth:0x81eEEbb902693A3a90948Fe0A661aedb35271054"
      values.$pastUpgrades.0.2.0:
-        "0x85a77E293a81d4C35F304951e41378E5e43d1f53"
+        "eth:0x85a77E293a81d4C35F304951e41378E5e43d1f53"
      values.$pastUpgrades.1.2.0:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.2.2.0:
-        "0x81eEEbb902693A3a90948Fe0A661aedb35271054"
+        "eth:0x81eEEbb902693A3a90948Fe0A661aedb35271054"
      values.bridge:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.getProxyAdmin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.sequencerInbox:
-        "0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      implementationNames.0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D:
-        "TransparentUpgradeableProxy"
      implementationNames.0x81eEEbb902693A3a90948Fe0A661aedb35271054:
-        "ERC20Inbox"
      implementationNames.eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x81eEEbb902693A3a90948Fe0A661aedb35271054:
+        "ERC20Inbox"
    }
```

```diff
    EOA  (0x982056C3214C4fbf59Ef97Cf4Be5107b17cb4F75) {
    +++ description: None
      address:
-        "0x982056C3214C4fbf59Ef97Cf4Be5107b17cb4F75"
+        "eth:0x982056C3214C4fbf59Ef97Cf4Be5107b17cb4F75"
    }
```

```diff
    contract OneStepProverMath (0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5"
+        "eth:0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5"
      implementationNames.0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5:
-        "OneStepProverMath"
      implementationNames.eth:0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5:
+        "OneStepProverMath"
    }
```

```diff
    EOA  (0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66) {
    +++ description: None
      address:
-        "0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66"
+        "eth:0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66"
    }
```

```diff
    EOA  (0xa017149a752BDd8723a09Cd6f40c388D38B8d202) {
    +++ description: None
      address:
-        "0xa017149a752BDd8723a09Cd6f40c388D38B8d202"
+        "eth:0xa017149a752BDd8723a09Cd6f40c388D38B8d202"
    }
```

```diff
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    EOA  (0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe) {
    +++ description: None
      address:
-        "0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe"
+        "eth:0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe"
    }
```

```diff
    contract ProxyAdmin (0xb90fe445014e74eA5aA7681291212bfEa37031CC) {
    +++ description: None
      address:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.owner:
-        "0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      implementationNames.0xb90fe445014e74eA5aA7681291212bfEa37031CC:
-        "ProxyAdmin"
      implementationNames.eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e) {
    +++ description: None
      address:
-        "0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e"
+        "eth:0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e"
    }
```

```diff
    EOA  (0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36) {
    +++ description: None
      address:
-        "0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36"
+        "eth:0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36"
    }
```

```diff
    contract OneStepProverMemory (0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe"
+        "eth:0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe"
      implementationNames.0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe:
-        "OneStepProverMemory"
      implementationNames.eth:0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe:
+        "OneStepProverMemory"
    }
```

```diff
    EOA  (0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e) {
    +++ description: None
      address:
-        "0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e"
+        "eth:0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e"
    }
```

```diff
    EOA  (0xd1e56283216127E1F40A3752735C94A13d97bc92) {
    +++ description: None
      address:
-        "0xd1e56283216127E1F40A3752735C94A13d97bc92"
+        "eth:0xd1e56283216127E1F40A3752735C94A13d97bc92"
    }
```

```diff
    contract UpgradeExecutor (0xd688dabDBb14D673898689135a23a174560c8C04) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
+        "eth:0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
      values.$pastUpgrades.0.2.0:
-        "0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
+        "eth:0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.executors.0:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0xd688dabDBb14D673898689135a23a174560c8C04:
-        "TransparentUpgradeableProxy"
      implementationNames.0x011d8F10fbC20C14B453768253CdFF7EB5B96917:
-        "UpgradeExecutor"
      implementationNames.eth:0xd688dabDBb14D673898689135a23a174560c8C04:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x011d8F10fbC20C14B453768253CdFF7EB5B96917:
+        "UpgradeExecutor"
    }
```

```diff
    contract ERC20Gateway (0xE2C902BC61296531e556962ffC81A082b82f5F28) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0xE2C902BC61296531e556962ffC81A082b82f5F28"
+        "eth:0xE2C902BC61296531e556962ffC81A082b82f5F28"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.$pastUpgrades.0.2.0:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.counterpartGateway:
-        "0x3955A911411cfae01c8B6Fd0D57c08DfE4428e38"
+        "eth:0x3955A911411cfae01c8B6Fd0D57c08DfE4428e38"
      values.inbox:
-        "0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
      values.l2BeaconProxyFactory:
-        "0x982056C3214C4fbf59Ef97Cf4Be5107b17cb4F75"
+        "eth:0x982056C3214C4fbf59Ef97Cf4Be5107b17cb4F75"
      values.router:
-        "0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
+        "eth:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xE2C902BC61296531e556962ffC81A082b82f5F28:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
-        "L1OrbitERC20Gateway"
      implementationNames.eth:0xE2C902BC61296531e556962ffC81A082b82f5F28:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
+        "L1OrbitERC20Gateway"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xEFE6F45507C24Bb85Fa25d417fe7d43763b9dE3d) {
    +++ description: None
      address:
-        "0xEFE6F45507C24Bb85Fa25d417fe7d43763b9dE3d"
+        "eth:0xEFE6F45507C24Bb85Fa25d417fe7d43763b9dE3d"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    contract RollupEventInbox (0xf576102530749344D2f4C04D15C2B8609c7897ea) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "eth:0xf576102530749344D2f4C04D15C2B8609c7897ea"
      values.$admin:
-        "0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      values.$implementation:
-        "0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
+        "eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
      values.$pastUpgrades.0.2.0:
-        "0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
+        "eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
      values.bridge:
-        "0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      values.rollup:
-        "0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      implementationNames.0xf576102530749344D2f4C04D15C2B8609c7897ea:
-        "TransparentUpgradeableProxy"
      implementationNames.0xb0f031Cd10598c6b4C33FcE1675F26CF937091da:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0xf576102530749344D2f4C04D15C2B8609c7897ea:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da:
+        "ERC20RollupEventInbox"
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0537c93dA3b1f8A525204165d1d93De0534c262f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
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
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) as source of truth for the DA referenced by the fault proof.
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
    contract ERC20Gateway (0xE2C902BC61296531e556962ffC81A082b82f5F28)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xf576102530749344D2f4C04D15C2B8609c7897ea)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

Generated with discovered.json: 0x2945411739de17ed8f5c423e93aa9fd822a21fdc

# Diff at Fri, 11 Jul 2025 12:30:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22744044
- current block number: 22895948

## Description

operator addresses removed.

## Watched changes

```diff
    contract RollupProxy (0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        3
      values.stakerCount:
-        2
+        1
      values.validators.5:
-        "0x8976384B54ecFeb9DEa150881008Ac43EFb27dE3"
    }
```

```diff
    contract SequencerInbox (0x85eC1b9138a8b9659A51e2b51bb0861901040b59) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.5:
-        "0x934653eC7C396f16069D6CDaC0960e699af14B3D"
      values.setIsBatchPosterCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x0c551f90df90b9905ed6c1d1d907e060e9ba143f

# Diff at Fri, 04 Jul 2025 12:19:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22744044
- current block number: 22744044

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22744044 (main branch discovery), not current.

```diff
    EOA  (0x006F5B7E2D58fb4E53DEdaB8802FCdf2a5441DC7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0x11f563dDbF266484Dd910A401A7e44299d80b1d5) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0x16C1D3b4aDB6f0F468FCE7b802cE5AA0A2B06d03) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0x17F187D978664C96ffD655996a45e085c403AD8b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0x2E8C0869C173cC07c58186E9DeEA74314635b1E2) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0x33Bf8bF5aF3579D0E2305302409A5b6b4173c779) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.1.from:
-        "ethereum:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
+        "eth:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
      receivedPermissions.2.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.2.from:
-        "ethereum:0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.3.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      receivedPermissions.4.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.4.from:
-        "ethereum:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+        "eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
      receivedPermissions.5.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.5.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      receivedPermissions.6.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.6.from:
-        "ethereum:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
+        "eth:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
      receivedPermissions.7.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.7.from:
-        "ethereum:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
      receivedPermissions.8.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.8.from:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.9.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.9.from:
-        "ethereum:0xE2C902BC61296531e556962ffC81A082b82f5F28"
+        "eth:0xE2C902BC61296531e556962ffC81A082b82f5F28"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      receivedPermissions.10.from:
-        "ethereum:0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "eth:0xf576102530749344D2f4C04D15C2B8609c7897ea"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
    }
```

```diff
    EOA  (0x4ed0f98FB4c331e672653E832c55E0f9F402C228) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0x74a0d46BA4F69cAB77A459f8B12dc531c7DaBf3C) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0x85e70D857F6Fad7AD4ffc3fC95FD0fd8C396A09D) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0x8976384B54ecFeb9DEa150881008Ac43EFb27dE3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0x934653eC7C396f16069D6CDaC0960e699af14B3D) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0x9DFaA1770bcE35EaB6a163D3cDE6cA1F3Ff7eA66) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0xa017149a752BDd8723a09Cd6f40c388D38B8d202) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    EOA  (0xA4f98Ac0E083C79BAB53A3895082e8a4fbf12CDe) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    contract ProxyAdmin (0xb90fe445014e74eA5aA7681291212bfEa37031CC) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
+        "eth:0x17551CBD1ed02768b00D5Bd198c2D86a4c7ee43d"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x35381f63091926750F43b2A7401B083263aDEF83"
+        "eth:0x35381f63091926750F43b2A7401B083263aDEF83"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
+        "eth:0x7e4627bC114Fcd12ba912103279FD2858E644E71"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
+        "eth:0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
+        "eth:0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xd688dabDBb14D673898689135a23a174560c8C04"
+        "eth:0xd688dabDBb14D673898689135a23a174560c8C04"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xE2C902BC61296531e556962ffC81A082b82f5F28"
+        "eth:0xE2C902BC61296531e556962ffC81A082b82f5F28"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xf576102530749344D2f4C04D15C2B8609c7897ea"
+        "eth:0xf576102530749344D2f4C04D15C2B8609c7897ea"
    }
```

```diff
    EOA  (0xb9B2AeAe8D160a5bF9cb7FE7B2c8B58c0293FD5e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0xc7ef93FE91D4658bb422B11C5f8Ae17ae3B86D36) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0xCEEAEC6b7e010fE1Ac253Ebd6f93eEBF9249Cd7e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
+        "eth:0x85eC1b9138a8b9659A51e2b51bb0861901040b59"
    }
```

```diff
    EOA  (0xd1e56283216127E1F40A3752735C94A13d97bc92) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

```diff
    contract UpgradeExecutor (0xd688dabDBb14D673898689135a23a174560c8C04) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
+        "eth:0xb90fe445014e74eA5aA7681291212bfEa37031CC"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
+        "eth:0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC"
    }
```

Generated with discovered.json: 0xc48a4cd264e2cda905e8b49a6ee122265ea6e05b

# Diff at Fri, 20 Jun 2025 06:57:17 GMT:

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

