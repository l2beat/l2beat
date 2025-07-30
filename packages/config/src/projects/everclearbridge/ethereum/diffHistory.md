Generated with discovered.json: 0xc360942414a9e947f8a511483c5c831cc2c954b8

# Diff at Wed, 30 Jul 2025 11:52:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fcb3491a2dac890d7d36ba1453e1feaeb3e13fec block: 1753687645
- current timestamp: 1753687645

## Description

Discovery rerun on the same block number with only config-related changes.
Source hash of implementation was added to EverclearSpokeV4 (previously it
wasn't added because proxy is not verified).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687645 (main branch discovery), not current.

```diff
    contract EverclearSpokeV4 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      sourceHashes:
+        [null,"0x45c33a33554c896aa6b125b932ea82f27e4c3bca281ad0d8c5c36a077a762bda"]
    }
```

Generated with discovered.json: 0x42a639700a1018b01a5f46e1b7ae8fab74f57f12

# Diff at Mon, 14 Jul 2025 12:46:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895905
- current block number: 22895905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895905 (main branch discovery), not current.

```diff
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3) {
    +++ description: None
      address:
-        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
+        "eth:0x000000000022D473030F116dDEE9F6B43aC78BA3"
      implementationNames.0x000000000022D473030F116dDEE9F6B43aC78BA3:
-        "Permit2"
      implementationNames.eth:0x000000000022D473030F116dDEE9F6B43aC78BA3:
+        "Permit2"
    }
```

```diff
    contract FeeAdapter (0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75) {
    +++ description: None
      address:
-        "0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75"
+        "eth:0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75"
      values.feeRecipient:
-        "0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
+        "eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
      values.feeSigner:
-        "0xd148C7f37b346a4bD8e14f8c1f181f5f640481C8"
+        "eth:0xd148C7f37b346a4bD8e14f8c1f181f5f640481C8"
      values.owner:
-        "0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
+        "eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.PERMIT2:
-        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
+        "eth:0x000000000022D473030F116dDEE9F6B43aC78BA3"
      values.spoke:
-        "0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "eth:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
      values.xerc20Module:
-        "0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
+        "eth:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
      implementationNames.0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75:
-        "FeeAdapter"
      implementationNames.eth:0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75:
+        "FeeAdapter"
    }
```

```diff
    EOA  (0x2eEd1440842990Fa61F0c396f981375Fa6004131) {
    +++ description: None
      address:
-        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
+        "eth:0x2eEd1440842990Fa61F0c396f981375Fa6004131"
    }
```

```diff
    EOA  (0x38f188953f1E3afE83327C78AAeF72e0498da2C6) {
    +++ description: None
      address:
-        "0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
+        "eth:0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
    }
```

```diff
    contract  (0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66) {
    +++ description: None
      address:
-        "0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
+        "eth:0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
      implementationNames.0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66:
-        ""
      implementationNames.eth:0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66:
+        ""
    }
```

```diff
    EOA  (0x5d334979C6f565b9646975AEdD2358D01f3db4c1) {
    +++ description: None
      address:
-        "0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
+        "eth:0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
    }
```

```diff
    EOA  (0x6281ea3060B26352b558C4F45767C90db482c4fd) {
    +++ description: None
      address:
-        "0x6281ea3060B26352b558C4F45767C90db482c4fd"
+        "eth:0x6281ea3060B26352b558C4F45767C90db482c4fd"
    }
```

```diff
    EOA  (0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315) {
    +++ description: None
      address:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "eth:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
    }
```

```diff
    contract  (0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7) {
    +++ description: None
      address:
-        "0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
+        "eth:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
      values.$admin:
-        "0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
+        "eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
      values.$implementation:
-        "0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
+        "eth:0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
      values.$pastUpgrades.0.2.0:
-        "0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
+        "eth:0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
      implementationNames.0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7:
-        ""
      implementationNames.0xe0F010e465f15dcD42098dF9b99F1038c11B3056:
-        ""
      implementationNames.eth:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7:
+        ""
      implementationNames.eth:0xe0F010e465f15dcD42098dF9b99F1038c11B3056:
+        ""
    }
```

```diff
    EOA  (0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f) {
    +++ description: None
      address:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "eth:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

```diff
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6) {
    +++ description: None
      address:
-        "0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
+        "eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xD976faAa19135dB4B846e43DdAaA9C66db842B7B"
+        "eth:0xD976faAa19135dB4B846e43DdAaA9C66db842B7B"
      values.$members.1:
-        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
+        "eth:0x2eEd1440842990Fa61F0c396f981375Fa6004131"
      values.$members.2:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "eth:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.$members.3:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "eth:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
      values.$members.4:
-        "0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
+        "eth:0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
      values.$members.5:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "eth:0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
      implementationNames.0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract EverclearSpokeV4 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      address:
-        "0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "eth:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
      values.$admin:
-        "0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
+        "eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
      values.$implementation:
-        "0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
+        "eth:0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
      values.$pastUpgrades.0.2.0:
-        "0x255aba6E7f08d40B19872D11313688c2ED65d1C9"
+        "eth:0x255aba6E7f08d40B19872D11313688c2ED65d1C9"
      values.$pastUpgrades.1.2.0:
-        "0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"
+        "eth:0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"
      values.$pastUpgrades.2.2.0:
-        "0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"
+        "eth:0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"
      values.$pastUpgrades.3.2.0:
-        "0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
+        "eth:0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
      values.callExecutor:
-        "0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
+        "eth:0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
      values.feeAdapter:
-        "0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75"
+        "eth:0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75"
      values.gateway:
-        "0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
+        "eth:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
      values.lighthouse:
-        "0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
+        "eth:0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
      values.messageReceiver:
-        "0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
+        "eth:0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
      values.owner:
-        "0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
+        "eth:0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6"
      values.PERMIT2:
-        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
+        "eth:0x000000000022D473030F116dDEE9F6B43aC78BA3"
      values.watchtower:
-        "0x6281ea3060B26352b558C4F45767C90db482c4fd"
+        "eth:0x6281ea3060B26352b558C4F45767C90db482c4fd"
      implementationNames.0xa05A3380889115bf313f1Db9d5f335157Be4D816:
-        ""
      implementationNames.0xd18C19169e7C87e7d84f27AD412a56C5D743D560:
-        "EverclearSpokeV4"
      implementationNames.eth:0xa05A3380889115bf313f1Db9d5f335157Be4D816:
+        ""
      implementationNames.eth:0xd18C19169e7C87e7d84f27AD412a56C5D743D560:
+        "EverclearSpokeV4"
    }
```

```diff
    EOA  (0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837) {
    +++ description: None
      address:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "eth:0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
    }
```

```diff
    EOA  (0xd148C7f37b346a4bD8e14f8c1f181f5f640481C8) {
    +++ description: None
      address:
-        "0xd148C7f37b346a4bD8e14f8c1f181f5f640481C8"
+        "eth:0xd148C7f37b346a4bD8e14f8c1f181f5f640481C8"
    }
```

```diff
    contract XERC20Module (0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4) {
    +++ description: None
      address:
-        "0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
+        "eth:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
      values.spoke:
-        "0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "eth:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
      implementationNames.0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4:
-        "XERC20Module"
      implementationNames.eth:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4:
+        "XERC20Module"
    }
```

```diff
    EOA  (0xD976faAa19135dB4B846e43DdAaA9C66db842B7B) {
    +++ description: None
      address:
-        "0xD976faAa19135dB4B846e43DdAaA9C66db842B7B"
+        "eth:0xD976faAa19135dB4B846e43DdAaA9C66db842B7B"
    }
```

```diff
    contract  (0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99) {
    +++ description: None
      address:
-        "0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
+        "eth:0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
      implementationNames.0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99:
-        ""
      implementationNames.eth:0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99:
+        ""
    }
```

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeAdapter (0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EverclearSpokeV4 (0xa05A3380889115bf313f1Db9d5f335157Be4D816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XERC20Module (0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99)
    +++ description: None
```

Generated with discovered.json: 0x6cf25f8a71934db11dcad8f5ec54579145e1ff09

# Diff at Fri, 11 Jul 2025 12:22:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22397509
- current block number: 22895905

## Description

One signer added.

## Watched changes

```diff
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6) {
    +++ description: None
      values.$members.0:
+        "0xD976faAa19135dB4B846e43DdAaA9C66db842B7B"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0xa90e2af0427811d2f8db992d5f2e7e49cd48cf7d

# Diff at Fri, 04 Jul 2025 12:18:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22397509
- current block number: 22397509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397509 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
+        "eth:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
      receivedPermissions.1.from:
-        "ethereum:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "eth:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
    }
```

Generated with discovered.json: 0x63fa73597f3b6308728450bac55adf36a9a52676

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22397509
- current block number: 22397509

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397509 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x912b6444b0142103fb4a358756e367318cc910e3

# Diff at Fri, 02 May 2025 17:25:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22281661
- current block number: 22397509

## Description

New feeAdapter contract which now acts as an entrypoint instead of the Spoke for  registering intents (on Ethereum).

## Watched changes

```diff
    contract EverclearSpokeV4 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "EverclearSpokeV3"
+        "EverclearSpokeV4"
      values.$implementation:
-        "0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"
+        "0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
      values.$pastUpgrades.3:
+        ["2025-04-29T11:43:35.000Z","0x268194204aceb79917b36ea1388c32aea7467aafe8592a320d52fcc09985b6a6",["0xd18C19169e7C87e7d84f27AD412a56C5D743D560"]]
      values.$upgradeCount:
-        3
+        4
      values.feeAdapter:
+        "0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75"
      derivedName:
-        "EverclearSpokeV3"
+        "EverclearSpokeV4"
    }
```

```diff
+   Status: CREATED
    contract FeeAdapter (0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XERC20Module (0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4)
    +++ description: None
```

## Source code changes

```diff
.../EverclearSpokeV4/EverclearSpokeV4.sol}         |  167 +-
 .../everclearbridge/ethereum/.flat/FeeAdapter.sol  | 1890 ++++++++++++++++++++
 .../ethereum/.flat/XERC20Module.sol                |  175 ++
 3 files changed, 2166 insertions(+), 66 deletions(-)
```

Generated with discovered.json: 0x0d3d8007f5abdd983a3be58631411488ef44a335

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22281661
- current block number: 22281661

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22281661 (main branch discovery), not current.

```diff
    contract  (0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6","via":[]}]
    }
```

```diff
    contract EverclearSpokeV3 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6","via":[]}]
    }
```

Generated with discovered.json: 0x907ab14d5461be8097a4c36670a5e8aeb92f0419

# Diff at Wed, 16 Apr 2025 12:49:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db872d8b788e204aeb64e983eeb7178891d61d76 block: 22187317
- current block number: 22281661

## Description

Minor upgrade for the Spoke contract.

## Watched changes

```diff
    contract EverclearSpokeV3 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "EverclearSpoke"
+        "EverclearSpokeV3"
      values.$implementation:
-        "0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"
+        "0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"
      values.$pastUpgrades.2:
+        ["2024-09-16T05:00:59.000Z","0x0a57cf4df6073bd8c65327851929577a0e711996ed48b5785422168356237b80",["0x255aba6E7f08d40B19872D11313688c2ED65d1C9"]]
      values.$pastUpgrades.1.2:
-        "2024-09-16T05:00:59.000Z"
+        "0xe1b76ceaae265ba0c3762b3143858112401f39d49c84020906c3a0f7544d9d74"
      values.$pastUpgrades.1.1:
-        ["0x255aba6E7f08d40B19872D11313688c2ED65d1C9"]
+        "2024-12-18T10:09:23.000Z"
      values.$pastUpgrades.1.0:
-        "0x0a57cf4df6073bd8c65327851929577a0e711996ed48b5785422168356237b80"
+        ["0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"]
      values.$pastUpgrades.0.2:
-        "0xe1b76ceaae265ba0c3762b3143858112401f39d49c84020906c3a0f7544d9d74"
+        ["0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"]
      values.$pastUpgrades.0.1:
-        "2024-12-18T10:09:23.000Z"
+        "0x4fa770e2446e25bbf87e7464bbc9c15afa45a4c4afdda25e34ee74b5eef1b20f"
      values.$pastUpgrades.0.0:
-        ["0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"]
+        "2025-04-15T09:38:11.000Z"
      values.$upgradeCount:
-        2
+        3
      derivedName:
-        "EverclearSpoke"
+        "EverclearSpokeV3"
    }
```

## Source code changes

```diff
.../EverclearSpokeV3/EverclearSpokeV3.sol}         | 115 +++++++++++++++------
 1 file changed, 82 insertions(+), 33 deletions(-)
```

Generated with discovered.json: 0xa123728ef1295667fe671cc65f8b8a5236407fb8

# Diff at Thu, 03 Apr 2025 08:52:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 22065300
- current block number: 22187317

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6) {
    +++ description: None
      values.$members.1:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
      values.$members.0:
-        "0xeb19B3Bdad53A775EB2d94d57D5a46c5260B0044"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

Generated with discovered.json: 0xe9c50b80396c9ae3d8272e3a8957929f39d373fb

# Diff at Mon, 17 Mar 2025 09:02:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22065300

## Description

Initial discovery, waiting for more contract verifications.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EverclearSpoke (0xa05A3380889115bf313f1Db9d5f335157Be4D816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99)
    +++ description: None
```
