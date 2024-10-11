Generated with discovered.json: 0x4e354eec060dee36a608f249b5e8a44f10ea30d8

# Diff at Tue, 01 Oct 2024 10:55:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20240852
- current block number: 20240852

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240852 (main branch discovery), not current.

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-08T19:58:23.000Z",["0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"]],["2023-04-27T02:38:47.000Z",["0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"]]]
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-21T22:41:47.000Z",["0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"]],["2023-02-03T23:06:47.000Z",["0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"]],["2023-04-23T04:37:11.000Z",["0x9512a85438606dEdE54297634dEd7C7C0c231874"]],["2023-06-26T23:20:23.000Z",["0xaF34771b16960ea77484A866a34CCDAFDc913D9C"]],["2023-09-20T19:37:35.000Z",["0x8775e9D584008f84daFe7abe75a62f6C91491027"]],["2023-09-22T14:15:59.000Z",["0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"]]]
    }
```

Generated with discovered.json: 0x7fa5352e64f49c1e8051f0480ca4244275a894b4

# Diff at Fri, 30 Aug 2024 08:01:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20240852
- current block number: 20240852

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240852 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe0c7aadb8e3c3ffcfd3520dd3974cfc3fb11a070

# Diff at Fri, 23 Aug 2024 09:55:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20240852
- current block number: 20240852

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240852 (main branch discovery), not current.

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

Generated with discovered.json: 0x1bbf8fb145a459105e0f11d0b01e4f995f51a663

# Diff at Wed, 21 Aug 2024 10:06:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20240852
- current block number: 20240852

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240852 (main branch discovery), not current.

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5a54fe5234E811466D5366846283323c954310B2"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5a54fe5234E811466D5366846283323c954310B2","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x902F09715B6303d4173037652FA7377e5b98089E"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x902F09715B6303d4173037652FA7377e5b98089E","via":[]}]
    }
```

Generated with discovered.json: 0xb78dfc69c6dea378b4a4ba9baaed0ac40255cb55

# Diff at Fri, 09 Aug 2024 10:12:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20240852
- current block number: 20240852

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240852 (main branch discovery), not current.

```diff
    contract StarGate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5a54fe5234E811466D5366846283323c954310B2"]
      assignedPermissions.upgrade:
+        ["0x5a54fe5234E811466D5366846283323c954310B2"]
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x902F09715B6303d4173037652FA7377e5b98089E"]
      assignedPermissions.upgrade:
+        ["0x902F09715B6303d4173037652FA7377e5b98089E"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xbc0988c485f24863dfe55a91479a9a50d14dd02b

# Diff at Fri, 05 Jul 2024 14:19:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 19532207
- current block number: 20240852

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532207 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113)
    +++ description: None
```

Generated with discovered.json: 0xe68bb3eb077b5467cdab7bf3fbb62717a6d63a4a

# Diff at Thu, 28 Mar 2024 11:08:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19433750
- current block number: 19532207

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19433750 (main branch discovery), not current.

```diff
    contract StarGate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x58e5e65bfca08d68390f2842b5da775add19380b

# Diff at Thu, 14 Mar 2024 14:12:08 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 19225512
- current block number: 19433750

## Description

New PriceFeed Oracle implementation has been deployed. Chain paths and liquidity data has been updated.

## Watched changes

```diff
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    +++ description: None
      upgradeability.implementation:
-        "0xF641db6860FD5f6643D05bD75405a2586a63a141"
+        "0x13dff8847EA170eBb8439ce732c0A14Bb49fDd92"
      implementations.0:
-        "0xF641db6860FD5f6643D05bD75405a2586a63a141"
+        "0x13dff8847EA170eBb8439ce732c0A14Bb49fDd92"
    }
```

## Source code changes

```diff
.../-0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x6aa238b93e1fb75daa84f0b1ea40a61326c2f152

# Diff at Wed, 14 Feb 2024 10:08:14 GMT

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@6045526c8b7e15993de0acdd037b3ffbaa1bedda block: 18820326
- current block number: 19225512

## Description

A new pool for mETH is added. The Default basis point multiplier of the Google Oracle is updated (related to fees). The latest version of the LayerZero Endpoint contract is updated:

- Version 4: 0xd231084bfb234c107d3ee2b22f97f3346fdaf705 (SendUln301)
- Version 5: 0x245b6e8ffe9ea5fc301e32d16f66bd4c2123eefc (ReceiveUln301)

## Watched changes

```diff
    contract Factory (0x06D538690AF257Da524f25D0CD52fD85b1c2173E) {
      values.allPools[12]:
+        "0xA572d137666DCbAdFA47C3fC41F15e90134C618c"
      values.allPoolsLength:
-        12
+        13
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      values.latestVersion:
-        3
+        5
    }
```

```diff
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
      values.defaultMultiplierBps:
-        12000
+        12100
    }
```

```diff
+   Status: CREATED
    contract mETH Pool (0xA572d137666DCbAdFA47C3fC41F15e90134C618c) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/access/Ownable.sol     |  68 +++
 .../@openzeppelin/contracts/math/SafeMath.sol      | 214 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../contracts/utils/ReentrancyGuard.sol            |  62 ++
 .../.code/mETH Pool/contracts/LPTokenERC20.sol     | 134 +++++
 .../ethereum/.code/mETH Pool/contracts/Pool.sol    | 644 +++++++++++++++++++++
 .../contracts/interfaces/IStargateFeeLibrary.sol   |  17 +
 .../stargate/ethereum/.code/mETH Pool/meta.txt     |   2 +
 8 files changed, 1165 insertions(+)
```

Generated with discovered.json: 0x98cb3e3594feadbd9145ee754066d371eda0c119

# Diff at Tue, 19 Dec 2023 13:36:06 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1e70db199340dc9df7ac0996900e54067b9d4f12

## Description

Added new config values.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.stargateOracles[1]:
+        "0x000000000000000000000000d56e4eab23cb81f43168f9f45211eb027b9ac7cc"
      values.stargateOracles[0]:
+        "0x0000000000000000000000005a54fe5234e811466d5366846283323c954310b2"
      values.stargateRelayers[0]:
+        "0x000000000000000000000000902f09715b6303d4173037652fa7377e5b98089e"
    }
```

# Diff at Thu, 23 Nov 2023 13:31:10 GMT

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: main@2ff45714640abe4c50d283967078888d4af81d78

## Description

StarGateFeeLibrary7 owner was replaced: 0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d -> 0x65bb797c2B9830d891D87288F029ed8dACc19705

## Watched changes

```diff
    contract StarGateFeeLibrary7 (0x8C3085D9a554884124C998CDB7f6d7219E9C1e6F) {
      values.owner:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
    }
```

# Diff at Fri, 17 Nov 2023 12:24:03 GMT

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

One EOA owner was replaced in StarGate Multisig:

- removed: 0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1
- added: 0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437

The same change was performed on a multisig in the Aptos project.

## Watched changes

```diff
    contract StarGate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
      values.getOwners.2:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.getOwners.1:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.getOwners.0:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```
