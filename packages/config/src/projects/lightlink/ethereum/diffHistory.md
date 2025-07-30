Generated with discovered.json: 0xdd65f8bdb57eeff9e8ac5d78268cc3b6870a2631

# Diff at Mon, 14 Jul 2025 12:45:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22208513
- current block number: 22208513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208513 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x12eCE4AA73ee8ea958bE327daE41Dd785c997118) {
    +++ description: None
      address:
-        "0x12eCE4AA73ee8ea958bE327daE41Dd785c997118"
+        "eth:0x12eCE4AA73ee8ea958bE327daE41Dd785c997118"
    }
```

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: Allows to challenge block headers. Each challenge requires the payment of a challenger fee. DA challenges are enabled: false. Header challenges are enabled: true. L2 Header challenges are enabled: false.
      address:
-        "0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
+        "eth:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
+        "eth:0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
      values.$pastUpgrades.0.2.0:
-        "0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"
+        "eth:0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"
      values.$pastUpgrades.1.2.0:
-        "0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
+        "eth:0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
      values.chain:
-        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      values.chainOracle:
-        "0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
+        "eth:0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
      values.daOracle:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.defender:
-        "0x514F8211B64f0620349659DeaDB5911a9896E7EC"
+        "eth:0x514F8211B64f0620349659DeaDB5911a9896E7EC"
      values.owner:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      implementationNames.0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd:
-        "CoreProxy"
      implementationNames.0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B:
-        "Challenge"
      implementationNames.eth:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd:
+        "CoreProxy"
      implementationNames.eth:0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B:
+        "Challenge"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: Used to challenge L2 block headers. If L2 block header challenges are inactive, this contract is not used.
      address:
-        "0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
+        "eth:0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0x79B3E839333a74137e78b0DaF84FC12512a8c704"
+        "eth:0x79B3E839333a74137e78b0DaF84FC12512a8c704"
      values.$pastUpgrades.0.2.0:
-        "0x79B3E839333a74137e78b0DaF84FC12512a8c704"
+        "eth:0x79B3E839333a74137e78b0DaF84FC12512a8c704"
      values.canonicalStateChain:
-        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      values.daOracle:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.rlpReader:
-        "0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2"
+        "eth:0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2"
      implementationNames.0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04:
-        "CoreProxy"
      implementationNames.0x79B3E839333a74137e78b0DaF84FC12512a8c704:
-        "ChainOracle"
      implementationNames.eth:0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04:
+        "CoreProxy"
      implementationNames.eth:0x79B3E839333a74137e78b0DaF84FC12512a8c704:
+        "ChainOracle"
    }
```

```diff
    contract Lightlink Multisig 1 (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: Custom multisig implementation with a hardcoded n/2+1 threshold.
      address:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
+        "eth:0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      values.getMemberByIndex.0:
-        "0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
+        "eth:0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
      values.getMemberByIndex.1:
-        "0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
+        "eth:0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
      values.getMembers.0:
-        "0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
+        "eth:0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
      values.getMembers.1:
-        "0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
+        "eth:0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
      values.multisig:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
+        "eth:0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      implementationNames.0x3345702FeA1669Efa1e085610A62F89d159Bc0c8:
-        "Multisig"
      implementationNames.eth:0x3345702FeA1669Efa1e085610A62F89d159Bc0c8:
+        "Multisig"
    }
```

```diff
    EOA  (0x514F8211B64f0620349659DeaDB5911a9896E7EC) {
    +++ description: None
      address:
-        "0x514F8211B64f0620349659DeaDB5911a9896E7EC"
+        "eth:0x514F8211B64f0620349659DeaDB5911a9896E7EC"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: The L1BridgeRegistry contract is used to store the address of the LightLink multisig and the address and voting power of the validators managing the bridge.
      address:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
+        "eth:0x624631881655a310adcF0d1336658Cc977609b72"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"
+        "eth:0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"
      values.$pastUpgrades.0.2.0:
-        "0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"
+        "eth:0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"
      values.getMultisig:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
+        "eth:0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      values.getSystemVerifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getValidators.0.addr:
-        "0x12eCE4AA73ee8ea958bE327daE41Dd785c997118"
+        "eth:0x12eCE4AA73ee8ea958bE327daE41Dd785c997118"
      values.getValidators.1.addr:
-        "0x6f933814903561F79137099587737DFB24c6E86D"
+        "eth:0x6f933814903561F79137099587737DFB24c6E86D"
      values.getValidators.2.addr:
-        "0xB44C32Dd1ec374224eED43FD827EBE64db16b0df"
+        "eth:0xB44C32Dd1ec374224eED43FD827EBE64db16b0df"
      values.getValidators.3.addr:
-        "0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9"
+        "eth:0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9"
      values.getValidators.4.addr:
-        "0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938"
+        "eth:0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938"
      values.multisig:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
+        "eth:0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      values.systemVerifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x624631881655a310adcF0d1336658Cc977609b72:
-        "BridgeProxy"
      implementationNames.0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E:
-        "L1BridgeRegistry"
      implementationNames.eth:0x624631881655a310adcF0d1336658Cc977609b72:
+        "BridgeProxy"
      implementationNames.eth:0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E:
+        "L1BridgeRegistry"
    }
```

```diff
    contract L1ERC20Predicate (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: ERC20 token escrow contract. It is validated by external validators, according to the L1BridgeRegistry values.
      address:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
+        "eth:0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"
+        "eth:0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"
      values.$pastUpgrades.0.2.0:
-        "0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"
+        "eth:0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"
      values.bridgeRegistry:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
+        "eth:0x624631881655a310adcF0d1336658Cc977609b72"
      values.l2Predicate:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
+        "eth:0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      implementationNames.0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9:
-        "PredicateProxy"
      implementationNames.0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E:
-        "L1ERC20Predicate"
      implementationNames.eth:0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9:
+        "PredicateProxy"
      implementationNames.eth:0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E:
+        "L1ERC20Predicate"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: Contains the logic to update the state of the chain, and apply rollbacks based on an external challenger contract. If a block header is challenged and rolled back, then all subsequent blocks are also rolled back.
      address:
-        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
+        "eth:0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
      values.$pastUpgrades.0.2.0:
-        "0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"
+        "eth:0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"
      values.$pastUpgrades.1.2.0:
-        "0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
+        "eth:0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
      values.challenge:
-        "0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
+        "eth:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
      values.owner:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.publisher:
-        "0x514F8211B64f0620349659DeaDB5911a9896E7EC"
+        "eth:0x514F8211B64f0620349659DeaDB5911a9896E7EC"
      implementationNames.0x65E325A22c0F519041db69F5693EbAc3b4AE71bE:
-        "CoreProxy"
      implementationNames.0xeFE38Bd58ADDf23eFab1FFa16312030384929289:
-        "CanonicalStateChain"
      implementationNames.eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE:
+        "CoreProxy"
      implementationNames.eth:0xeFE38Bd58ADDf23eFab1FFa16312030384929289:
+        "CanonicalStateChain"
    }
```

```diff
    contract SystemConfig (0x670E1C42A7A5962348138110E3ede3F422c10e2f) {
    +++ description: Fork of the OP stack's SystemConfig. It link to the main portal contract and stores a 'start block' number. Both values are currently unused. Most importantly, it does NOT contain the resource configuration info.
      address:
-        "0x670E1C42A7A5962348138110E3ede3F422c10e2f"
+        "eth:0x670E1C42A7A5962348138110E3ede3F422c10e2f"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0x9EC8231132d6722D463077a7cCe1432c3766d9A2"
+        "eth:0x9EC8231132d6722D463077a7cCe1432c3766d9A2"
      values.$pastUpgrades.0.2.0:
-        "0x9EC8231132d6722D463077a7cCe1432c3766d9A2"
+        "eth:0x9EC8231132d6722D463077a7cCe1432c3766d9A2"
      values.optimismPortal:
-        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      values.owner:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      implementationNames.0x670E1C42A7A5962348138110E3ede3F422c10e2f:
-        "Proxy"
      implementationNames.0x9EC8231132d6722D463077a7cCe1432c3766d9A2:
-        "SystemConfig"
      implementationNames.eth:0x670E1C42A7A5962348138110E3ede3F422c10e2f:
+        "Proxy"
      implementationNames.eth:0x9EC8231132d6722D463077a7cCe1432c3766d9A2:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91) {
    +++ description: None
      address:
-        "0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
+        "eth:0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
    }
```

```diff
    EOA  (0x6F17201F241231f183CE52212e4C47B009036421) {
    +++ description: None
      address:
-        "0x6F17201F241231f183CE52212e4C47B009036421"
+        "eth:0x6F17201F241231f183CE52212e4C47B009036421"
    }
```

```diff
    EOA  (0x6f933814903561F79137099587737DFB24c6E86D) {
    +++ description: None
      address:
-        "0x6f933814903561F79137099587737DFB24c6E86D"
+        "eth:0x6f933814903561F79137099587737DFB24c6E86D"
    }
```

```diff
    contract Lightlink Multisig 2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7) {
    +++ description: None
      address:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
+        "eth:0x67Ad58C203cEB0f39026270D920cc0f29eB4eE91"
      values.$members.1:
-        "0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
+        "eth:0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
      values.$members.2:
-        "0x6F17201F241231f183CE52212e4C47B009036421"
+        "eth:0x6F17201F241231f183CE52212e4C47B009036421"
      implementationNames.0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract L1CrossDomainMessenger (0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
+        "eth:0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0x38104856c02f83f4048c0FBA3D7613042FEAc988"
+        "eth:0x38104856c02f83f4048c0FBA3D7613042FEAc988"
      values.$pastUpgrades.0.2.0:
-        "0x38104856c02f83f4048c0FBA3D7613042FEAc988"
+        "eth:0x38104856c02f83f4048c0FBA3D7613042FEAc988"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      values.PORTAL:
-        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      implementationNames.0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38:
-        "Proxy"
      implementationNames.0x38104856c02f83f4048c0FBA3D7613042FEAc988:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38:
+        "Proxy"
      implementationNames.eth:0x38104856c02f83f4048c0FBA3D7613042FEAc988:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9) {
    +++ description: None
      address:
-        "0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9"
+        "eth:0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9"
    }
```

```diff
    contract LightLinkPortal (0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE) {
    +++ description: Main contract to deposit ETH and handle L1 to L2 messages. It also allows to prove and finalize withdrawals. It also stores the resource configuration for the chain.
      address:
-        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0x3B1ADfe78B9B4107c47267AE97e2a91b1D8811fD"
+        "eth:0x3B1ADfe78B9B4107c47267AE97e2a91b1D8811fD"
      values.$pastUpgrades.0.2.0:
-        "0x3B1ADfe78B9B4107c47267AE97e2a91b1D8811fD"
+        "eth:0x3B1ADfe78B9B4107c47267AE97e2a91b1D8811fD"
      values.l2Oracle:
-        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.owner:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      implementationNames.0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE:
-        "Proxy"
      implementationNames.0x3B1ADfe78B9B4107c47267AE97e2a91b1D8811fD:
-        "LightLinkPortal"
      implementationNames.eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE:
+        "Proxy"
      implementationNames.eth:0x3B1ADfe78B9B4107c47267AE97e2a91b1D8811fD:
+        "LightLinkPortal"
    }
```

```diff
    EOA  (0xB44C32Dd1ec374224eED43FD827EBE64db16b0df) {
    +++ description: None
      address:
-        "0xB44C32Dd1ec374224eED43FD827EBE64db16b0df"
+        "eth:0xB44C32Dd1ec374224eED43FD827EBE64db16b0df"
    }
```

```diff
    contract L1StandardBridge (0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c"
+        "eth:0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c"
      values.$admin:
-        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
+        "eth:0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$implementation:
-        "0xCE7Ab4b8471A3119aabB63101b7C7B999464Fc48"
+        "eth:0xCE7Ab4b8471A3119aabB63101b7C7B999464Fc48"
      values.$pastUpgrades.0.2.0:
-        "0xCE7Ab4b8471A3119aabB63101b7C7B999464Fc48"
+        "eth:0xCE7Ab4b8471A3119aabB63101b7C7B999464Fc48"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
+        "eth:0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
      values.MESSENGER:
-        "0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
+        "eth:0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c:
-        "Proxy"
      implementationNames.0xCE7Ab4b8471A3119aabB63101b7C7B999464Fc48:
-        "L1StandardBridge"
      implementationNames.eth:0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c:
+        "Proxy"
      implementationNames.eth:0xCE7Ab4b8471A3119aabB63101b7C7B999464Fc48:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938) {
    +++ description: None
      address:
-        "0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938"
+        "eth:0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938"
    }
```

```diff
    EOA  (0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590) {
    +++ description: None
      address:
-        "0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
+        "eth:0xdE2552948aacb82dCa7a04AffbcB1B8e3C97D590"
    }
```

```diff
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2) {
    +++ description: None
      address:
-        "0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2"
+        "eth:0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2"
      implementationNames.0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2:
-        "RLPReader"
      implementationNames.eth:0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2:
+        "RLPReader"
    }
```

```diff
+   Status: CREATED
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd)
    +++ description: Allows to challenge block headers. Each challenge requires the payment of a challenger fee. DA challenges are enabled: false. Header challenges are enabled: true. L2 Header challenges are enabled: false.
```

```diff
+   Status: CREATED
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04)
    +++ description: Used to challenge L2 block headers. If L2 block header challenges are inactive, this contract is not used.
```

```diff
+   Status: CREATED
    contract Lightlink Multisig 1 (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8)
    +++ description: Custom multisig implementation with a hardcoded n/2+1 threshold.
```

```diff
+   Status: CREATED
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72)
    +++ description: The L1BridgeRegistry contract is used to store the address of the LightLink multisig and the address and voting power of the validators managing the bridge.
```

```diff
+   Status: CREATED
    contract L1ERC20Predicate (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9)
    +++ description: ERC20 token escrow contract. It is validated by external validators, according to the L1BridgeRegistry values.
```

```diff
+   Status: CREATED
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE)
    +++ description: Contains the logic to update the state of the chain, and apply rollbacks based on an external challenger contract. If a block header is challenged and rolled back, then all subsequent blocks are also rolled back.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x670E1C42A7A5962348138110E3ede3F422c10e2f)
    +++ description: Fork of the OP stack's SystemConfig. It link to the main portal contract and stores a 'start block' number. Both values are currently unused. Most importantly, it does NOT contain the resource configuration info.
```

```diff
+   Status: CREATED
    contract Lightlink Multisig 2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract LightLinkPortal (0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE)
    +++ description: Main contract to deposit ETH and handle L1 to L2 messages. It also allows to prove and finalize withdrawals. It also stores the resource configuration for the chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2)
    +++ description: None
```

Generated with discovered.json: 0x2c16fd9851e9debedd5027a1555915a12c5cc5d8

# Diff at Fri, 04 Jul 2025 12:19:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22208513
- current block number: 22208513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208513 (main branch discovery), not current.

```diff
    contract Lightlink Multisig 1 (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: Custom multisig implementation with a hardcoded n/2+1 threshold.
      receivedPermissions.0.from:
-        "ethereum:0x624631881655a310adcF0d1336658Cc977609b72"
+        "eth:0x624631881655a310adcF0d1336658Cc977609b72"
    }
```

```diff
    EOA  (0x514F8211B64f0620349659DeaDB5911a9896E7EC) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
    }
```

```diff
    contract Lightlink Multisig 2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
+        "eth:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
      receivedPermissions.1.from:
-        "ethereum:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      receivedPermissions.2.from:
-        "ethereum:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      receivedPermissions.3.from:
-        "ethereum:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
+        "eth:0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
      receivedPermissions.4.from:
-        "ethereum:0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
+        "eth:0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
      receivedPermissions.5.from:
-        "ethereum:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "eth:0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      receivedPermissions.6.from:
-        "ethereum:0x670E1C42A7A5962348138110E3ede3F422c10e2f"
+        "eth:0x670E1C42A7A5962348138110E3ede3F422c10e2f"
      receivedPermissions.7.from:
-        "ethereum:0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
+        "eth:0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
      receivedPermissions.8.from:
-        "ethereum:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      receivedPermissions.9.from:
-        "ethereum:0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c"
+        "eth:0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c"
    }
```

Generated with discovered.json: 0xa4546692824d3aa440143a2bec3bdaed32fc2b20

# Diff at Fri, 23 May 2025 09:40:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22208513
- current block number: 22208513

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208513 (main branch discovery), not current.

```diff
    contract Lightlink Multisig 1 (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: Custom multisig implementation with a hardcoded n/2+1 threshold.
      receivedPermissions.0.role:
+        ".multisig"
    }
```

```diff
    EOA  (0x514F8211B64f0620349659DeaDB5911a9896E7EC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".publisher"
    }
```

```diff
    contract Lightlink Multisig 2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7) {
    +++ description: None
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
      receivedPermissions.5.description:
-        "it can update the maximum number of Celestia pointers a block can have, change the challenge contract used for rollbacks and update the publisher address."
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"
+        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
+        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
      receivedPermissions.3.description:
-        "it can disable L2 header challenges and DA challenges, it can update the challenge period (3h and 3 weeks), update the challenger fee (between 0.01 and 10 ether), update the challenge reward (between 0.01 and 10 ether), update the defender address, update the DA namespace, update the DA oracle, disable header challenges and set the maximum bundle size."
+        "it can update the maximum number of Celestia pointers a block can have, change the challenge contract used for rollbacks and update the publisher address."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
+        "0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
      receivedPermissions.2.description:
+        "it can disable L2 header challenges and DA challenges, it can update the challenge period (3h and 3 weeks), update the challenger fee (between 0.01 and 10 ether), update the challenge reward (between 0.01 and 10 ether), update the defender address, update the DA namespace, update the DA oracle, disable header challenges and set the maximum bundle size."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xd5396e23a67847aef87d655edc853c668152254b

# Diff at Tue, 29 Apr 2025 08:19:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208513
- current block number: 22208513

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208513 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: Allows to challenge block headers. Each challenge requires the payment of a challenger fee. DA challenges are enabled: false. Header challenges are enabled: true. L2 Header challenges are enabled: false.
      issuedPermissions:
-        [{"permission":"interact","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","description":"it can disable L2 header challenges and DA challenges, it can update the challenge period (3h and 3 weeks), update the challenger fee (between 0.01 and 10 ether), update the challenge reward (between 0.01 and 10 ether), update the defender address, update the DA namespace, update the DA oracle, disable header challenges and set the maximum bundle size.","via":[]},{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: Used to challenge L2 block headers. If L2 block header challenges are inactive, this contract is not used.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: The L1BridgeRegistry contract is used to store the address of the LightLink multisig and the address and voting power of the validators managing the bridge.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","description":"can remove and add validators, update their voting power, and change the required threshold.","via":[]}]
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: Contains the logic to update the state of the chain, and apply rollbacks based on an external challenger contract. If a block header is challenged and rolled back, then all subsequent blocks are also rolled back.
      issuedPermissions:
-        [{"permission":"interact","to":"0x514F8211B64f0620349659DeaDB5911a9896E7EC","description":"it can publish new block headers, which both includes pointers to Celestia DA and the state root for withdrawals, meaning that sequencing and state updates are not decoupled.","via":[]},{"permission":"interact","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","description":"it can update the maximum number of Celestia pointers a block can have, change the challenge contract used for rollbacks and update the publisher address.","via":[]},{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}]
    }
```

```diff
    contract SystemConfig (0x670E1C42A7A5962348138110E3ede3F422c10e2f) {
    +++ description: Fork of the OP stack's SystemConfig. It link to the main portal contract and stores a 'start block' number. Both values are currently unused. Most importantly, it does NOT contain the resource configuration info.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}]
    }
```

```diff
    contract LightLinkPortal (0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE) {
    +++ description: Main contract to deposit ETH and handle L1 to L2 messages. It also allows to prove and finalize withdrawals. It also stores the resource configuration for the chain.
      issuedPermissions:
-        [{"permission":"interact","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","description":"it can pause the chain and update the gas token.","via":[]},{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[]}]
    }
```

Generated with discovered.json: 0x6bea77bbe9bc82a61758417fc32d44c845fa143f

# Diff at Thu, 10 Apr 2025 14:42:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208513
- current block number: 22208513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208513 (main branch discovery), not current.

```diff
    contract Lightlink Multisig 1 (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: Custom multisig implementation with a hardcoded n/2+1 threshold.
      displayName:
-        "LightlinkMultisig"
    }
```

Generated with discovered.json: 0xd9d8dc4516ad1fddec5c41e42331929386f5a710

# Diff at Thu, 03 Apr 2025 16:12:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 21995407
- current block number: 22189498

## Description

Lightlink moves to opstack (partly).

## Watched changes

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: Contains the logic to update the state of the chain, and apply rollbacks based on an external challenger contract. If a block header is challenged and rolled back, then all subsequent blocks are also rolled back.
      values.chainHead:
-        1168
+        1280
      values.getHead.epoch:
-        21993309
+        22187754
      values.getHead.l2Height:
-        132108607
+        136759159
      values.getHead.prevHash:
-        "0x0357f67f6fa768ac91770152e7bebe923951d349f2648f8886c87c63d737e9dc"
+        "0x13498280d1840253acf9037a65d1f32ae475fec6783fc96558d0b7061d414767"
      values.getHead.outputRoot:
-        "0x62314ae58400e70955d971703a83315a1cf702aef43d048e47f39cbf9925efb7"
+        "0x56d4485d2c8ec043386f5d8a5834075e352263448f68dc6f0b0749d38654ad64"
      values.getHead.celestiaPointers.20.height:
-        4336314
+        4740181
      values.getHead.celestiaPointers.20.shareStart:
-        5376
+        8832
      values.getHead.celestiaPointers.20.shareLen:
-        3664
+        3537
      values.getHead.celestiaPointers.19.height:
-        4336284
+        4740151
      values.getHead.celestiaPointers.19.shareStart:
-        6080
+        8960
      values.getHead.celestiaPointers.19.shareLen:
-        3655
+        3664
      values.getHead.celestiaPointers.18.height:
-        4336102
+        4740135
      values.getHead.celestiaPointers.18.shareStart:
-        9344
+        5696
      values.getHead.celestiaPointers.18.shareLen:
-        3663
+        3656
      values.getHead.celestiaPointers.17.height:
-        4336343
+        4740165
      values.getHead.celestiaPointers.17.shareStart:
-        6208
+        5952
      values.getHead.celestiaPointers.17.shareLen:
-        3664
+        3542
      values.getHead.celestiaPointers.16.height:
-        4336227
+        4739924
      values.getHead.celestiaPointers.16.shareStart:
-        9920
+        5376
      values.getHead.celestiaPointers.16.shareLen:
-        3664
+        3631
      values.getHead.celestiaPointers.15.height:
-        4336358
+        4739864
      values.getHead.celestiaPointers.15.shareStart:
-        6848
+        8832
      values.getHead.celestiaPointers.15.shareLen:
-        3529
+        3665
      values.getHead.celestiaPointers.14.height:
-        4336241
+        4740099
      values.getHead.celestiaPointers.14.shareStart:
-        6784
+        7424
      values.getHead.celestiaPointers.14.shareLen:
-        3546
+        3662
      values.getHead.celestiaPointers.13.height:
-        4336143
+        4739895
      values.getHead.celestiaPointers.13.shareStart:
-        6784
+        5760
      values.getHead.celestiaPointers.13.shareLen:
-        3664
+        3545
      values.getHead.celestiaPointers.12.height:
-        4336210
+        4739958
      values.getHead.celestiaPointers.12.shareStart:
-        1344
+        5952
      values.getHead.celestiaPointers.12.shareLen:
-        3664
+        3646
      values.getHead.celestiaPointers.11.height:
-        4336303
+        4740044
      values.getHead.celestiaPointers.11.shareStart:
-        3456
+        8192
      values.getHead.celestiaPointers.11.shareLen:
-        3657
+        3664
      values.getHead.celestiaPointers.10.height:
-        4336118
+        4740195
      values.getHead.celestiaPointers.10.shareStart:
-        4096
+        9408
      values.getHead.celestiaPointers.10.shareLen:
-        3662
+        3167
      values.getHead.celestiaPointers.9.height:
-        4336329
+        4740010
      values.getHead.celestiaPointers.9.shareStart:
-        4352
+        7936
      values.getHead.celestiaPointers.9.shareLen:
-        3665
+        3579
      values.getHead.celestiaPointers.8.height:
-        4336193
+        4740025
      values.getHead.celestiaPointers.8.shareStart:
-        7744
+        5248
      values.getHead.celestiaPointers.8.shareLen:
-        3635
+        3582
      values.getHead.celestiaPointers.7.height:
-        4336127
+        4740080
      values.getHead.celestiaPointers.7.shareStart:
-        4352
+        9280
      values.getHead.celestiaPointers.7.shareLen:
-        3663
+        3605
      values.getHead.celestiaPointers.6.height:
-        4336258
+        4740119
      values.getHead.celestiaPointers.6.shareStart:
-        1792
+        5184
      values.getHead.celestiaPointers.6.shareLen:
-        3652
+        3665
      values.getHead.celestiaPointers.5.height:
-        4336175
+        4739940
      values.getHead.celestiaPointers.5.shareStart:
-        1792
+        8576
      values.getHead.celestiaPointers.5.shareLen:
-        3664
+        3576
      values.getHead.celestiaPointers.4.height:
-        4336373
+        4739880
      values.getHead.celestiaPointers.4.shareStart:
-        4416
+        6208
      values.getHead.celestiaPointers.4.shareLen:
-        3664
+        3259
      values.getHead.celestiaPointers.3.height:
-        4336090
+        4739978
      values.getHead.celestiaPointers.3.shareStart:
-        6912
+        9408
      values.getHead.celestiaPointers.3.shareLen:
-        3658
+        3437
      values.getHead.celestiaPointers.2.height:
-        4336161
+        4739997
      values.getHead.celestiaPointers.2.shareStart:
-        3840
+        5504
      values.getHead.celestiaPointers.2.shareLen:
-        3665
+        3432
      values.getHead.celestiaPointers.1.height:
-        4336273
+        4739912
      values.getHead.celestiaPointers.1.shareStart:
-        2688
+        6464
      values.getHead.celestiaPointers.1.shareLen:
-        3465
+        3447
      values.getHead.celestiaPointers.0.height:
-        4336382
+        4740063
      values.getHead.celestiaPointers.0.shareStart:
-        6976
+        7872
      values.getHead.celestiaPointers.0.shareLen:
-        3415
+        3224
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995407 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: Allows to challenge block headers. Each challenge requires the payment of a challenger fee. DA challenges are enabled: false. Header challenges are enabled: true. L2 Header challenges are enabled: false.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.description:
+        "it can disable L2 header challenges and DA challenges, it can update the challenge period (3h and 3 weeks), update the challenger fee (between 0.01 and 10 ether), update the challenge reward (between 0.01 and 10 ether), update the defender address, update the DA namespace, update the DA oracle, disable header challenges and set the maximum bundle size."
      values.proxiableUUID:
-        "EXPECT_REVERT"
      template:
+        "lightlink/Challenge"
      description:
+        "Allows to challenge block headers. Each challenge requires the payment of a challenger fee. DA challenges are enabled: false. Header challenges are enabled: true. L2 Header challenges are enabled: false."
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: Used to challenge L2 block headers. If L2 block header challenges are inactive, this contract is not used.
      values.proxiableUUID:
-        "EXPECT_REVERT"
      template:
+        "lightlink/ChainOracle"
      description:
+        "Used to challenge L2 block headers. If L2 block header challenges are inactive, this contract is not used."
    }
```

```diff
    contract Lightlink Multisig 1 (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: Custom multisig implementation with a hardcoded n/2+1 threshold.
      name:
-        "LightLinkMultisig"
+        "Lightlink Multisig 1"
      receivedPermissions.2:
-        {"permission":"upgrade","from":"0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"}
      receivedPermissions.1:
-        {"permission":"upgrade","from":"0x3ca373F5ecB92ac762f9876f6e773082A4589995"}
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.description:
+        "can remove and add validators, update their voting power, and change the required threshold."
      template:
+        "lightlink/Multisig"
      displayName:
+        "LightlinkMultisig"
      description:
+        "Custom multisig implementation with a hardcoded n/2+1 threshold."
    }
```

```diff
-   Status: DELETED
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995)
    +++ description: None
```

```diff
    contract undefined (0x514F8211B64f0620349659DeaDB5911a9896E7EC) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x65E325A22c0F519041db69F5693EbAc3b4AE71bE","description":"it can publish new block headers, which both includes pointers to Celestia DA and the state root for withdrawals, meaning that sequencing and state updates are not decoupled."}]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: The L1BridgeRegistry contract is used to store the address of the LightLink multisig and the address and voting power of the validators managing the bridge.
      proxyType:
-        "LightLink proxy"
+        "EIP1967 proxy"
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.description:
+        "can remove and add validators, update their voting power, and change the required threshold."
      values.$admin:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
+        "0x0000000000000000000000000000000000000000"
      values.proxiableUUID:
-        "EXPECT_REVERT"
      template:
+        "lightlink/L1BridgeRegistry"
      description:
+        "The L1BridgeRegistry contract is used to store the address of the LightLink multisig and the address and voting power of the validators managing the bridge."
    }
```

```diff
    contract L1ERC20Predicate (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: ERC20 token escrow contract. It is validated by external validators, according to the L1BridgeRegistry values.
      name:
-        "LightLinkERC20Bridge"
+        "L1ERC20Predicate"
      proxyType:
-        "LightLink proxy"
+        "EIP1967 proxy"
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
      values.$admin:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
+        "0x0000000000000000000000000000000000000000"
      values.proxiableUUID:
-        "EXPECT_REVERT"
      template:
+        "lightlink/L1ERC20Predicate"
      description:
+        "ERC20 token escrow contract. It is validated by external validators, according to the L1BridgeRegistry values."
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: Contains the logic to update the state of the chain, and apply rollbacks based on an external challenger contract. If a block header is challenged and rolled back, then all subsequent blocks are also rolled back.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x514F8211B64f0620349659DeaDB5911a9896E7EC","description":"it can publish new block headers, which both includes pointers to Celestia DA and the state root for withdrawals, meaning that sequencing and state updates are not decoupled.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.description:
+        "it can update the maximum number of Celestia pointers a block can have, change the challenge contract used for rollbacks and update the publisher address."
      values.proxiableUUID:
-        "EXPECT_REVERT"
      template:
+        "lightlink/CanonicalStateChain"
      description:
+        "Contains the logic to update the state of the chain, and apply rollbacks based on an external challenger contract. If a block header is challenged and rolled back, then all subsequent blocks are also rolled back."
    }
```

```diff
    contract Lightlink Multisig 2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7) {
    +++ description: None
      name:
-        "LightLinkMultisig2"
+        "Lightlink Multisig 2"
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x670E1C42A7A5962348138110E3ede3F422c10e2f"}
      receivedPermissions.5:
+        {"permission":"interact","from":"0x65E325A22c0F519041db69F5693EbAc3b4AE71bE","description":"it can update the maximum number of Celestia pointers a block can have, change the challenge contract used for rollbacks and update the publisher address."}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38"}
      receivedPermissions.3:
+        {"permission":"interact","from":"0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd","description":"it can disable L2 header challenges and DA challenges, it can update the challenge period (3h and 3 weeks), update the challenger fee (between 0.01 and 10 ether), update the challenge reward (between 0.01 and 10 ether), update the defender address, update the DA namespace, update the DA oracle, disable header challenges and set the maximum bundle size."}
      receivedPermissions.2.from:
-        "0x65E325A22c0F519041db69F5693EbAc3b4AE71bE"
+        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      receivedPermissions.1.from:
-        "0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd"
+        "0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04"
+        "0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE"
      receivedPermissions.0.description:
+        "it can pause the chain and update the gas token."
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x670E1C42A7A5962348138110E3ede3F422c10e2f)
    +++ description: Fork of the OP stack's SystemConfig. It link to the main portal contract and stores a 'start block' number. Both values are currently unused. Most importantly, it does NOT contain the resource configuration info.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xA30eAe91b9184Bb5e14b86Dd10d463F67c699C38)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract LightLinkPortal (0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE)
    +++ description: Main contract to deposit ETH and handle L1 to L2 messages. It also allows to prove and finalize withdrawals. It also stores the resource configuration for the chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xc7a7199bb5F0aA7B54eca90fC793Ec83E5683b0c)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

Generated with discovered.json: 0xb8dd9229039c5a02baf2195aaa8f441676c84444

# Diff at Fri, 07 Mar 2025 13:54:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21965148
- current block number: 21995407

## Description

Some admin / owner permissions moved from EOA to 3/3 Safe (Lightlink is moving to an op stack deployment).

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$admin:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.owner:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$admin:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.owner:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$admin:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.owner:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
    }
```

```diff
+   Status: CREATED
    contract LightLinkMultisig2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/LightLinkMultisig2/Safe.sol     | 1088 ++++++++++++++++++++
 .../.flat/LightLinkMultisig2/SafeProxy.p.sol       |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0x13930dbbea129921bcf7b679eb9666e1091da8b7

# Diff at Tue, 04 Mar 2025 10:39:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21965148
- current block number: 21965148

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21965148 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      sinceBlock:
+        20019970
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      sinceBlock:
+        20019967
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      sinceBlock:
+        17924532
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      sinceBlock:
+        17924604
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      sinceBlock:
+        17924561
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      sinceBlock:
+        17924631
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      sinceBlock:
+        20019964
    }
```

```diff
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2) {
    +++ description: None
      sinceBlock:
+        20019965
    }
```

Generated with discovered.json: 0x41fbeddb0beeaaa5231b6983d4e63632ac9f9313

# Diff at Mon, 03 Mar 2025 08:56:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f23dcb100957b0b121d62148a4d586788383af80 block: 21635772
- current block number: 21965148

## Description

Bridge paused, all ETH moved into a multisig. Probably connected to them [moving their infra to the op stack fork](https://x.com/LightLinkChain/status/1895145558777491655).

Put project under review and added warning.

## Watched changes

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      values.getTransactionCount:
-        20
+        22
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.isPaused:
-        false
+        true
    }
```

Generated with discovered.json: 0xbbcde6f4cf20ea4afecee0a70bd58d5420735883

# Diff at Mon, 20 Jan 2025 11:09:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635772
- current block number: 21635772

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635772 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
      issuedPermissions.0.to:
+        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
      issuedPermissions.0.to:
+        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      receivedPermissions.2.target:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      receivedPermissions.2.from:
+        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      receivedPermissions.1.target:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
      receivedPermissions.1.from:
+        "0x624631881655a310adcF0d1336658Cc977609b72"
      receivedPermissions.0.target:
-        "0x3ca373F5ecB92ac762f9876f6e773082A4589995"
      receivedPermissions.0.from:
+        "0x3ca373F5ecB92ac762f9876f6e773082A4589995"
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      issuedPermissions.0.to:
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      issuedPermissions.0.to:
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      issuedPermissions.0.to:
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
      issuedPermissions.0.to:
+        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
    }
```

Generated with discovered.json: 0xd22ac770c67618fe25028f67511a3b768170cfb9

# Diff at Thu, 16 Jan 2025 08:12:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21422626
- current block number: 21635772

## Description

challengeWindow (the effective challenge period) increased to 5d.

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.challengeWindow:
-        259200
+        432000
      values.finalizationSeconds:
-        432000
+        604800
    }
```

Generated with discovered.json: 0x42d845827fac948c43b2b8dc33a91a58b310e9ae

# Diff at Mon, 21 Oct 2024 11:07:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]
      values.$pastUpgrades.1.1:
-        ["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]
+        "0x4395a7f970de1003c82254f83fbf42c5f11a97842d23ff171be9d0d6c683010b"
      values.$pastUpgrades.0.2:
+        ["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]
      values.$pastUpgrades.0.1:
-        ["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]
+        "0x84c616f81289c7637be644c43b7a1bf740daa615896f9bb9d141c3d383c4b6f1"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]
      values.$pastUpgrades.0.1:
-        ["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]
+        "0x777ffc74cdda4dadf5067e5736ed319792fa6e37c5eab24573e3fd01f33e2334"
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x468b89D930ca7974196D7195033600B658011756"]
      values.$pastUpgrades.0.1:
-        ["0x468b89D930ca7974196D7195033600B658011756"]
+        "0xa5257a1dff2fd90764950a9d0b5767fcf4d7a9d1fb7d27084ccfc03b78e947d2"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]
      values.$pastUpgrades.0.1:
-        ["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]
+        "0xd39a80831c0c0fdc27b6e030d6e1a393b0d3cbc0f8b9d22d0fa2046b33e2fc76"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]
      values.$pastUpgrades.0.1:
-        ["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]
+        "0x2a6786734b18517394bf675986e76ba59c82e093d87180792e3f5287c98af7a0"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]
      values.$pastUpgrades.1.1:
-        ["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]
+        "0xcc066ac45b2d6527afdb41a5254a2093bcbc6d8e7d8571f6139b08db97f6e50b"
      values.$pastUpgrades.0.2:
+        ["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]
      values.$pastUpgrades.0.1:
-        ["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]
+        "0x39c4618d14675071a6b0f6183c7cf605373987d3ed2677426598aa67e5d15e56"
    }
```

Generated with discovered.json: 0x85b4f192d1b2fba467c4bb6306bd5a80063c3804

# Diff at Mon, 14 Oct 2024 10:52:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      sourceHashes:
+        ["0x7e52f67f6162bc66d00626c817dcd5b11c2189fcf7bf5efcd32fd0821c22c0ad","0x90fc7abf9460afe3940188c51d98ab5da40ece530f7fc0e6e10c459a1b7f35f5"]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      sourceHashes:
+        ["0x7e52f67f6162bc66d00626c817dcd5b11c2189fcf7bf5efcd32fd0821c22c0ad","0x219c5860c98ee65c799aa9b6549168915088c6de2369583a157ee3a60cf65b47"]
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      sourceHashes:
+        ["0x4bbdb661859a4bbfa25496630a4c393bc0999fe0bdf4910997d7c098294d19e6"]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      sourceHashes:
+        ["0x271f364b7e28b516246603be8769c5002d3e585faea009e131bf170f073129e8","0x71f4b3f45f14bd6064069c36b9bb52b9b3efa4e4b40344614eaad2e50f5b78c6"]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      sourceHashes:
+        ["0xb5af2f6166dd24adeb4b7faf21f2bbfc8512fe699c249b64b565127766ff6e3d","0xc12eca0e011860efa4f71723a172994a15e062d037a0d89ef36b5aed423fb37a"]
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      sourceHashes:
+        ["0x271f364b7e28b516246603be8769c5002d3e585faea009e131bf170f073129e8","0xc53e364c720158d2d3f89d1c4ffb1a3550689489699dfdaca67ee8a51967c9cc"]
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      sourceHashes:
+        ["0x7e52f67f6162bc66d00626c817dcd5b11c2189fcf7bf5efcd32fd0821c22c0ad","0x7c0a4f7fb2f2948ffde2e5550debf14c02fa682bec9a57aac718daf43c80c2c7"]
    }
```

```diff
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2) {
    +++ description: None
      sourceHashes:
+        ["0xa54be4566b369d95be75b2911bdb9216ec62e1bc5dc86dff8ec6bcff42c7ec28"]
    }
```

Generated with discovered.json: 0x91707214dfe048181dad5534da69db6b710d6c12

# Diff at Tue, 01 Oct 2024 10:52:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:32:23.000Z",["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]],["2024-09-05T13:35:35.000Z",["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]]]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:31:47.000Z",["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]]]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T03:06:47.000Z",["0x468b89D930ca7974196D7195033600B658011756"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T02:57:47.000Z",["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T03:12:11.000Z",["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:31:11.000Z",["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]],["2024-09-05T13:31:35.000Z",["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]]]
    }
```

Generated with discovered.json: 0x3e7db4030a9e68b02999c798868fa8c2066511dc

# Diff at Thu, 05 Sep 2024 15:26:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01da0bcdde8e77051659c9718e449a44f5f957a block: 20117905
- current block number: 20685269

## Description

Small upgrade:

### Challenge.sol
- new `finalizationSeconds()` returns challengePeriod + challengeWindow

### CanonicalStateChain.sol
- new `OutputProposed` event for each new output root (on `pushBlock()`)
- `output root = keccack(version_hash || keccack(state_root || withdrawal_root || latest_block_hash))`
- new `getL2Output()` returns outputRoot, timestamp

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$implementation:
-        "0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"
+        "0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
      values.$upgradeCount:
-        1
+        2
      values.finalizationSeconds:
+        432000
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$implementation:
-        "0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"
+        "0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
      values.$upgradeCount:
-        1
+        2
      values.startingTimestamp:
+        1717522271
    }
```

## Source code changes

```diff
.../CanonicalStateChain/CanonicalStateChain.sol    | 37 ++++++++++++++++++++--
 .../Challenge/Challenge.sol                        |  5 +++
 2 files changed, 40 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x6d6b9df731962a3b59a97d94d7b57792794c1bed

# Diff at Fri, 30 Aug 2024 07:53:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbfab149ef568896625f0220e4db9c67e96c97804

# Diff at Fri, 23 Aug 2024 09:52:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xeedfb4ae7298c593a94252f1f8cb181c45cee40c

# Diff at Wed, 21 Aug 2024 10:03:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x624631881655a310adcF0d1336658Cc977609b72","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3ca373F5ecB92ac762f9876f6e773082A4589995","via":[]},{"permission":"upgrade","target":"0x624631881655a310adcF0d1336658Cc977609b72","via":[]},{"permission":"upgrade","target":"0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9","via":[]}]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

Generated with discovered.json: 0xf9ba057c7ad16038bcecbd934f422fb7841592e2

# Diff at Fri, 09 Aug 2024 12:00:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
+        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      assignedPermissions.upgrade.1:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
+        "0x624631881655a310adcF0d1336658Cc977609b72"
    }
```

Generated with discovered.json: 0xc83644e57cef1e7beae3dfcb0e282d087d0f16b1

# Diff at Fri, 09 Aug 2024 10:10:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x624631881655a310adcF0d1336658Cc977609b72","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"]
      assignedPermissions.upgrade:
+        ["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9","0x624631881655a310adcF0d1336658Cc977609b72"]
    }
```

Generated with discovered.json: 0x2053af4a0dff819953516c381e96cf97096d863a

# Diff at Tue, 18 Jun 2024 09:58:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e3611555e0b885dd86d383737fd13f2f80d29e5d block: 20083371
- current block number: 20117905

## Description

Introduce the LightLink proxy type.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20083371 (main branch discovery), not current.

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

Generated with discovered.json: 0x5b0656336e187bb0466ffcb9ed0d53058db03a56

# Diff at Thu, 13 Jun 2024 14:03:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@9b539b55e8e7d4d20892b6f527f5c9e27bd65f80 block: 20061082
- current block number: 20083371

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20061082 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.daNamespace:
-        ["0x00","0x00000000000000000000000000000000000000000000000000000000"]
+        {"version":"0x00","id":"0x00000000000000000000000000000000000000000000000000000000"}
    }
```

```diff
    contract Multisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      name:
-        "Multisig"
+        "LightLinkMultisig"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.getValidators.4:
-        ["0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938",40]
+        {"addr":"0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938","power":40}
      values.getValidators.3:
-        ["0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9",40]
+        {"addr":"0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9","power":40}
      values.getValidators.2:
-        ["0xB44C32Dd1ec374224eED43FD827EBE64db16b0df",20]
+        {"addr":"0xB44C32Dd1ec374224eED43FD827EBE64db16b0df","power":20}
      values.getValidators.1:
-        ["0x6f933814903561F79137099587737DFB24c6E86D",20]
+        {"addr":"0x6f933814903561F79137099587737DFB24c6E86D","power":20}
      values.getValidators.0:
-        ["0x12eCE4AA73ee8ea958bE327daE41Dd785c997118",40]
+        {"addr":"0x12eCE4AA73ee8ea958bE327daE41Dd785c997118","power":40}
    }
```

Generated with discovered.json: 0x9ed1eacb739e181fea2cb650b2ef14492f71700c

# Diff at Mon, 10 Jun 2024 11:17:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20061082

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2)
    +++ description: None
```
