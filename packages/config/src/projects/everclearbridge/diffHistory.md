Generated with discovered.json: 0x69671302c817a1efa85f2a6104ca05c786c50911

# Diff at Wed, 15 Oct 2025 13:47:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3b2c8898ebe0c61228f50617e2de65973094dd39 block: 1760090060
- current timestamp: 1760535562

## Description

config: remove everclear contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1760090060 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (everclear:0x001Fffde58224F8617C82bAf3E466a2dEBb8078E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (everclear:0x3a464f746D23Ab22155710f44dB16dcA53e0775E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (everclear:0x3C2b535a49c6827DF0b8e94467e6922c99E3c092)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OwnableMulticall (everclear:0x5c333d2284b36AeB1739C54dB2a729Fd15f80c35)
    +++ description: None
```

```diff
-   Status: DELETED
    contract InterchainAccountRouter (everclear:0x6FD739221F53F8dc1565F3aF830Cb687cfe5932D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OwnableMulticall (everclear:0x7a7716A400aA13B156317D683Ae2097db18B3E55)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Mailbox (everclear:0x7f50C5776722630a0024fAE05fDe8b47571D7B39)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (everclear:0xa3C641dF20C64E0D2a8a60147A4043DAab8ad896)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProtocolFee (everclear:0xC49aF4965264FA7BB6424CE37aA06773ad177224)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (everclear:0xcdBE2995Af304e9c14dF5B0c3d7C9CCc63D7b8B3)
    +++ description: None
```

Generated with discovered.json: 0x5892675d2ae05ee0e93c0aa0c2ee8126b93ed6e7

# Diff at Fri, 10 Oct 2025 09:59:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a91384a270a047b2514885e053feff1edc24f495 block: 1754908695
- current timestamp: 1760090060

## Description

Upgrade, still many contracts unverified.

## Watched changes

```diff
    contract HubGatewayV2 (everclear:0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      name:
-        ""
+        "HubGatewayV2"
      unverified:
-        true
      values.$implementation:
-        "everclear:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
+        "everclear:0xd8681612290EDD610E70f082Ef1015b25B597f5c"
      values.$pastUpgrades.1:
+        ["2025-10-08T17:36:13.000Z","0x81dfc1c668cca1cb56cbe1f414057bdb8e5e041959802fed6584d5f7a0abfd21",["everclear:0xd8681612290EDD610E70f082Ef1015b25B597f5c"]]
      values.$upgradeCount:
-        1
+        2
      values.interchainSecurityModule:
+        "everclear:0xcdBE2995Af304e9c14dF5B0c3d7C9CCc63D7b8B3"
      values.mailbox:
+        "everclear:0x7f50C5776722630a0024fAE05fDe8b47571D7B39"
      values.owner:
+        "everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.receiver:
+        "everclear:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
      implementationNames.everclear:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4:
-        ""
      implementationNames.everclear:0xd8681612290EDD610E70f082Ef1015b25B597f5c:
+        "HubGatewayV2"
      template:
+        "everclearbridge/EverclearHubGateway"
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xf6a49ba2bca4b5e8e2890b00f9d7641caf549b07f3d57a3678765b6b43daed33"]
    }
```

```diff
+   Status: CREATED
    contract  (everclear:0x001Fffde58224F8617C82bAf3E466a2dEBb8078E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (everclear:0x3a464f746D23Ab22155710f44dB16dcA53e0775E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (everclear:0x3C2b535a49c6827DF0b8e94467e6922c99E3c092)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OwnableMulticall (everclear:0x5c333d2284b36AeB1739C54dB2a729Fd15f80c35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InterchainAccountRouter (everclear:0x6FD739221F53F8dc1565F3aF830Cb687cfe5932D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OwnableMulticall (everclear:0x7a7716A400aA13B156317D683Ae2097db18B3E55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Mailbox (everclear:0x7f50C5776722630a0024fAE05fDe8b47571D7B39)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (everclear:0xa3C641dF20C64E0D2a8a60147A4043DAab8ad896)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolFee (everclear:0xC49aF4965264FA7BB6424CE37aA06773ad177224)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (everclear:0xcdBE2995Af304e9c14dF5B0c3d7C9CCc63D7b8B3)
    +++ description: None
```

## Source code changes

```diff
.../everclearbridge/.flat/DomainRoutingIsm.sol     | 2468 +++++++++++
 .../HubGatewayV2}/ERC1967Proxy.p.sol               |    0
 .../.flat/HubGatewayV2/HubGatewayV2.sol            | 1753 ++++++++
 .../.flat/InterchainAccountRouter.sol              | 4312 ++++++++++++++++++++
 .../everclearbridge/.flat/Mailbox/Mailbox.sol      | 1374 +++++++
 .../Mailbox/TransparentUpgradeableProxy.p.sol      |  729 ++++
 ...:0x5c333d2284b36AeB1739C54dB2a729Fd15f80c35.sol |  451 ++
 .../OwnableMulticall.p.sol                         |  451 ++
 .../OwnableMulticall.sol                           |  451 ++
 .../projects/everclearbridge/.flat/ProtocolFee.sol |  842 ++++
 .../projects/everclearbridge/.flat/ProxyAdmin.sol  |  147 +
 11 files changed, 12978 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754908695 (main branch discovery), not current.

```diff
    contract  (everclear:0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      name:
-        "EverclearHubGateway"
+        ""
    }
```

Generated with discovered.json: 0x2d891aef450faeea75229d6d77a791dbd6e0779d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x4894c75d0e86f14542c603ce51ad26ddc784bb10

# Diff at Mon, 11 Aug 2025 10:38:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1753687645
- current timestamp: 1754908695

## Description

Small upgrade to the Spoke (dynamic gas limit added): https://disco.l2beat.com/diff/eth:0xd18C19169e7C87e7d84f27AD412a56C5D743D560/eth:0xb0CE951eF4655C73E42E3c7D85eF166E7c615Af7

many unverified contracts, project not reviewed or on website.

## Watched changes

```diff
    contract EverclearSpokeV5 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "EverclearSpokeV4"
+        "EverclearSpokeV5"
      sourceHashes.1:
-        "0x45c33a33554c896aa6b125b932ea82f27e4c3bca281ad0d8c5c36a077a762bda"
+        "0x183579075859d89358960a3d0a89ae170c5b81c70cb81f7e4b72e5ff310afb7f"
      values.$implementation:
-        "eth:0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
+        "eth:0xb0CE951eF4655C73E42E3c7D85eF166E7c615Af7"
      values.$pastUpgrades.4:
+        ["2025-08-08T10:47:47.000Z","0xdf6c967f149d75daef55e22dd9d164b5db17524aa520d60d438528ada4717036",["eth:0xb0CE951eF4655C73E42E3c7D85eF166E7c615Af7"]]
      values.$upgradeCount:
-        4
+        5
      values.messageGasLimit:
-        2000000
+        5000000
      values.PROCESS_FILL_QUEUE_VIA_RELAYER_TYPEHASH:
-        "0x0afae807991f914b71165fd92589f1dc28648cb9fb1f8558f3a6c7507d56deff"
+        "0xfff2306b4d1a2b16ba8a4ba32d8ed8136d2cc882aea58ada6b2baedcde647f57"
      values.PROCESS_INTENT_QUEUE_VIA_RELAYER_TYPEHASH:
-        "0x8104c8a42e1531612796e696e327ea52a475d9583ee6d64ffdefcafad22c0b24"
+        "0x87c42ffc42ddf0cd52b5e8a0b1fa6c45338db7d6e7c93f9d2943eb42b2706aca"
      implementationNames.eth:0xd18C19169e7C87e7d84f27AD412a56C5D743D560:
-        "EverclearSpokeV4"
      implementationNames.eth:0xb0CE951eF4655C73E42E3c7D85eF166E7c615Af7:
+        "EverclearSpokeV5"
    }
```

## Source code changes

```diff
.../EverclearSpokeV5/EverclearSpokeV5.sol}         | 182 ++++++++++-----------
 1 file changed, 91 insertions(+), 91 deletions(-)
```

Generated with discovered.json: 0xc360942414a9e947f8a511483c5c831cc2c954b8

# Diff at Wed, 30 Jul 2025 11:52:37 GMT:

- chain: ethereum
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

Generated with discovered.json: 0x098bc0d201f663df4a456001f8bea5a741b2f742

# Diff at Mon, 28 Jul 2025 07:27:55 GMT:

- chain: everclear
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 1846362
- current block number: 2044435

## Description

Safe verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1846362 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8) {
    +++ description: None
      name:
-        ""
+        "GnosisSafeL2"
      unverified:
-        true
      values.domainSeparator:
+        "0xfeb14725916df3e8c12da42b211e3398ceddd12e47bfd3596eae526b73460ae6"
      values.getChainId:
+        25327
      values.VERSION:
+        "1.3.0"
      implementationNames.everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8:
-        ""
+        "GnosisSafeProxy"
      implementationNames.everclear:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        ""
+        "GnosisSafeL2"
      template:
+        "GnosisSafe"
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

Generated with discovered.json: 0x660a9dadcd19db99cf6578bb09d1bf7ab4607e5d

# Diff at Mon, 14 Jul 2025 12:46:54 GMT:

- chain: everclear
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 1846362
- current block number: 1846362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1846362 (main branch discovery), not current.

```diff
    EOA  (0x2eEd1440842990Fa61F0c396f981375Fa6004131) {
    +++ description: None
      address:
-        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
+        "everclear:0x2eEd1440842990Fa61F0c396f981375Fa6004131"
    }
```

```diff
    EOA  (0x38f188953f1E3afE83327C78AAeF72e0498da2C6) {
    +++ description: None
      address:
-        "0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
+        "everclear:0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
    }
```

```diff
    EOA  (0x5d334979C6f565b9646975AEdD2358D01f3db4c1) {
    +++ description: None
      address:
-        "0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
+        "everclear:0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
    }
```

```diff
    EOA  (0x6281ea3060B26352b558C4F45767C90db482c4fd) {
    +++ description: None
      address:
-        "0x6281ea3060B26352b558C4F45767C90db482c4fd"
+        "everclear:0x6281ea3060B26352b558C4F45767C90db482c4fd"
    }
```

```diff
    EOA  (0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315) {
    +++ description: None
      address:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "everclear:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
    }
```

```diff
    EOA  (0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f) {
    +++ description: None
      address:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "everclear:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      address:
-        "0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "everclear:0xa05A3380889115bf313f1Db9d5f335157Be4D816"
      values.$admin:
-        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
+        "everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.$implementation.0:
-        "0x255aba6E7f08d40B19872D11313688c2ED65d1C9"
+        "everclear:0x255aba6E7f08d40B19872D11313688c2ED65d1C9"
      values.$implementation.1:
-        "0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
+        "everclear:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
      values.$implementation.2:
-        "0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
+        "everclear:0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
      values.$implementation.3:
-        "0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
+        "everclear:0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
      values.$implementation.4:
-        "0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
+        "everclear:0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
      values.$pastUpgrades.0.2.0:
-        "0x255aba6E7f08d40B19872D11313688c2ED65d1C9"
+        "everclear:0x255aba6E7f08d40B19872D11313688c2ED65d1C9"
      values.$pastUpgrades.0.2.1:
-        "0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
+        "everclear:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7"
      values.$pastUpgrades.0.2.2:
-        "0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
+        "everclear:0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99"
      values.$pastUpgrades.0.2.3:
-        "0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
+        "everclear:0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66"
      values.$pastUpgrades.0.2.4:
-        "0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
+        "everclear:0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
      values.$pastUpgrades.0.2.5:
-        "0x0000000000000000000000000000000000000000"
+        "everclear:0x0000000000000000000000000000000000000000"
+++ description: role 1: ADMIN, role 2: ASSET_MANAGER
      values.activeRoles.1.0:
-        "0xBF67dfcdC720E7bcaAdca6e1092f3A65207b7874"
+        "everclear:0xBF67dfcdC720E7bcaAdca6e1092f3A65207b7874"
+++ description: role 1: ADMIN, role 2: ASSET_MANAGER
      values.activeRoles.2.0:
-        "0xba1c05257B3a9Bb8f822e164913a3eE1198411Ed"
+        "everclear:0xba1c05257B3a9Bb8f822e164913a3eE1198411Ed"
      values.hubGateway:
-        "0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"
+        "everclear:0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"
      values.lighthouse:
-        "0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
+        "everclear:0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
      values.managerModule:
-        "0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
+        "everclear:0xe0F010e465f15dcD42098dF9b99F1038c11B3056"
      values.owner:
-        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
+        "everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.proposedOwner:
-        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
+        "everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.watchtower:
-        "0x6281ea3060B26352b558C4F45767C90db482c4fd"
+        "everclear:0x6281ea3060B26352b558C4F45767C90db482c4fd"
      implementationNames.0xa05A3380889115bf313f1Db9d5f335157Be4D816:
-        "ERC1967Proxy"
      implementationNames.0x255aba6E7f08d40B19872D11313688c2ED65d1C9:
-        "EverclearHub"
      implementationNames.0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7:
-        "Settler"
      implementationNames.0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99:
-        "Handler"
      implementationNames.0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66:
-        "HubMessageReceiver"
      implementationNames.0xe0F010e465f15dcD42098dF9b99F1038c11B3056:
-        "Manager"
      implementationNames.everclear:0xa05A3380889115bf313f1Db9d5f335157Be4D816:
+        "ERC1967Proxy"
      implementationNames.everclear:0x255aba6E7f08d40B19872D11313688c2ED65d1C9:
+        "EverclearHub"
      implementationNames.everclear:0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7:
+        "Settler"
      implementationNames.everclear:0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99:
+        "Handler"
      implementationNames.everclear:0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66:
+        "HubMessageReceiver"
      implementationNames.everclear:0xe0F010e465f15dcD42098dF9b99F1038c11B3056:
+        "Manager"
    }
```

```diff
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8) {
    +++ description: None
      address:
-        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
+        "everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "everclear:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
+        "everclear:0x38f188953f1E3afE83327C78AAeF72e0498da2C6"
      values.$members.1:
-        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
+        "everclear:0x2eEd1440842990Fa61F0c396f981375Fa6004131"
      values.$members.2:
-        "0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
+        "everclear:0x5d334979C6f565b9646975AEdD2358D01f3db4c1"
      values.$members.3:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "everclear:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
      values.$members.4:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "everclear:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.$members.5:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "everclear:0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
      implementationNames.0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8:
-        ""
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        ""
      implementationNames.everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8:
+        ""
      implementationNames.everclear:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        ""
    }
```

```diff
    EOA  (0xba1c05257B3a9Bb8f822e164913a3eE1198411Ed) {
    +++ description: None
      address:
-        "0xba1c05257B3a9Bb8f822e164913a3eE1198411Ed"
+        "everclear:0xba1c05257B3a9Bb8f822e164913a3eE1198411Ed"
    }
```

```diff
    EOA  (0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837) {
    +++ description: None
      address:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "everclear:0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
    }
```

```diff
    EOA  (0xBF67dfcdC720E7bcaAdca6e1092f3A65207b7874) {
    +++ description: None
      address:
-        "0xBF67dfcdC720E7bcaAdca6e1092f3A65207b7874"
+        "everclear:0xBF67dfcdC720E7bcaAdca6e1092f3A65207b7874"
    }
```

```diff
    contract EverclearHubGateway (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      address:
-        "0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"
+        "everclear:0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"
      values.$admin:
-        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
+        "everclear:0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.$implementation:
-        "0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
+        "everclear:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
      values.$pastUpgrades.0.2.0:
-        "0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
+        "everclear:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4"
      implementationNames.0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa:
-        "ERC1967Proxy"
      implementationNames.0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4:
-        ""
      implementationNames.everclear:0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa:
+        "ERC1967Proxy"
      implementationNames.everclear:0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4:
+        ""
    }
```

```diff
+   Status: CREATED
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EverclearHubGateway (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa)
    +++ description: None
```

Generated with discovered.json: 0x42a639700a1018b01a5f46e1b7ae8fab74f57f12

# Diff at Mon, 14 Jul 2025 12:46:54 GMT:

- chain: ethereum
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

- chain: ethereum
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

Generated with discovered.json: 0x3caf6a7c3b0d9db7932beaf9741a0fdf00732a47

# Diff at Mon, 07 Jul 2025 08:11:47 GMT:

- chain: everclear
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 1122116
- current block number: 1846362

## Description

epochlength halved. problem with disco and the hub diamond. 

## Watched changes

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      values.epochLength:
-        40
+        20
    }
```

Generated with discovered.json: 0xa90e2af0427811d2f8db992d5f2e7e49cd48cf7d

# Diff at Fri, 04 Jul 2025 12:18:59 GMT:

- chain: ethereum
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

Generated with discovered.json: 0xfb89c3d6dd7de952bc2bc0a937843ed77b755668

# Diff at Tue, 27 May 2025 08:31:37 GMT:

- chain: everclear
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 1122116
- current block number: 1122116

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1122116 (main branch discovery), not current.

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      sourceHashes.5:
-        "0x7128ff67025fb2bcb219505d0a80a78e76013becea566de4efba404b7869bc9f"
      sourceHashes.4:
-        "0x62c0ff182f9767f2e54f31e47ffd6587cc114b97ea994c85864c11c8116eb229"
      sourceHashes.3:
-        "0xa9aa0764f18d93b6c8773c69f72f6bdd86c3135b4f310eb2c0e2eb5ae5d0aa30"
      sourceHashes.2:
-        "0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6"
      sourceHashes.1:
-        "0x8225b12393daa7489701089347eb52c11b768a1c177a6cd227092c9aefd97b85"
+        "0x457307c82577abe25e93c7096a0773b8bc37c55a1373212df91feeee68559f79"
      sourceHashes.0:
-        "0x1e60affed7805f9a7e3ab1afdf31c05e81f9a8977725c508d6222e816b67806f"
+        "0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6"
    }
```

Generated with discovered.json: 0x8c58c554120451fa4334c7995add21d56e0be024

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- chain: everclear
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 1122116
- current block number: 1122116

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1122116 (main branch discovery), not current.

```diff
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x63fa73597f3b6308728450bac55adf36a9a52676

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- chain: ethereum
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

Generated with discovered.json: 0xaa2958eb49bead398a9a6932552d340b62bada8e

# Diff at Tue, 06 May 2025 13:32:26 GMT:

- chain: everclear
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@09b97f14e3365304f798b0b4fc6971d693d1eb2f block: 1122116
- current block number: 1122116

## Description

everclear

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1122116 (main branch discovery), not current.

```diff
    contract EverclearHubGateway (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      name:
-        ""
+        "EverclearHubGateway"
    }
```

Generated with discovered.json: 0x912b6444b0142103fb4a358756e367318cc910e3

# Diff at Fri, 02 May 2025 17:25:41 GMT:

- chain: ethereum
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

Generated with discovered.json: 0xec4773fd507f8820236087bc5025494557a42ae4

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- chain: everclear
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 1122116
- current block number: 1122116

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1122116 (main branch discovery), not current.

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8","via":[]}]
    }
```

```diff
    contract  (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8","via":[]}]
    }
```

Generated with discovered.json: 0x0d3d8007f5abdd983a3be58631411488ef44a335

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- chain: ethereum
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

- chain: ethereum
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

Generated with discovered.json: 0x66bd7d7b43beb5d88dcab7767438596fce959eb0

# Diff at Mon, 14 Apr 2025 12:48:39 GMT:

- chain: everclear
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@22d5bd9958c2ffcb130d83154e0650da7c63f262 block: 1077934
- current block number: 1107577

## Description

supported domains added.

## Watched changes

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      values.supportedDomains.21:
+        324
      values.supportedDomains.20:
+        146
      values.supportedDomains.19:
+        137
      values.supportedDomains.18:
+        130
      values.supportedDomains.17:
-        324
+        100
      values.supportedDomains.16:
-        137
+        1
      values.supportedDomains.15:
-        130
+        8453
      values.supportedDomains.14:
-        100
+        5000
      values.supportedDomains.13:
-        1
+        2020
      values.supportedDomains.12:
-        8453
+        167000
      values.supportedDomains.11:
-        2020
+        81457
      values.supportedDomains.10:
-        167000
+        80094
      values.supportedDomains.9:
-        81457
+        59144
      values.supportedDomains.8:
-        59144
+        57073
    }
```

Generated with discovered.json: 0xec98cd69992257a9ad296440e0d88daeb132bbe1

# Diff at Thu, 10 Apr 2025 14:44:06 GMT:

- chain: everclear
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 1077934
- current block number: 1077934

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1077934 (main branch discovery), not current.

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "ERC1967Proxy"
+        "EverclearHub"
      displayName:
-        "EverclearHub"
    }
```

Generated with discovered.json: 0xf763ad9b042251968d1cbc9c2c5f4a5bbb7eb51b

# Diff at Thu, 03 Apr 2025 09:39:36 GMT:

- chain: everclear
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 938182
- current block number: 1041412

## Description

Supported domain added (100 - GnosisChain). ms member changes.

## Watched changes

```diff
    contract ERC1967Proxy (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      values.supportedDomains.17:
+        324
      values.supportedDomains.16:
-        324
+        137
      values.supportedDomains.15:
-        137
+        130
      values.supportedDomains.14:
-        130
+        100
    }
```

```diff
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"0xa05A3380889115bf313f1Db9d5f335157Be4D816"}
      receivedPermissions.0.from:
-        "0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"
      values.$members.1:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
      values.$members.0:
-        "0xeb19B3Bdad53A775EB2d94d57D5a46c5260B0044"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

```diff
    contract undefined (0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"}]
    }
```

```diff
    contract  (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.$admin:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
    }
```

Generated with discovered.json: 0xa123728ef1295667fe671cc65f8b8a5236407fb8

# Diff at Thu, 03 Apr 2025 08:52:57 GMT:

- chain: ethereum
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

- chain: ethereum
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

Generated with discovered.json: 0xbc54a4c597cb0568386b7a7a3025b4aac4d1f727

# Diff at Mon, 17 Mar 2025 08:23:04 GMT:

- chain: everclear
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 938182

## Description

Initial discovery using the custom Everclear proxy handler.

## Initial discovery

```diff
+   Status: CREATED
    contract ERC1967Proxy (0xa05A3380889115bf313f1Db9d5f335157Be4D816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa)
    +++ description: None
```

