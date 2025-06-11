Generated with discovered.json: 0x5f5aaedab15af3d4f98db6027f29592b09afc7a2

# Diff at Wed, 11 Jun 2025 10:17:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1e5f82b7e56cabcf167a872860d558a4d17e6da2 block: 20641250
- current block number: 22680529

## Description

initial disco of the new honeypot

## Watched changes

```diff
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      name:
+        "Application"
      sourceHashes:
+        ["0x040a3525c8ccc1fbd5fef3a9e0b3087a477f2f7d77e358637619e3c8702615ac"]
      sinceTimestamp:
+        1749510467
      sinceBlock:
+        22670193
      values:
+        {"$immutable":true,"getDataAvailability":"0xb12c9ede000000000000000000000000c70074bdd26d8cf983ca6a5b89b8db52d5850051","getDeploymentBlockNumber":22670193,"getOutputsMerkleRootValidator":"0x6CE590b9F0697327f18c601DF6f0baE4a0801B68","getTemplateHash":"0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14","owner":"0x0000000000000000000000000000000000000000","wasOutputExecuted":[false,false,false,false,false]}
      errors:
+        {"wasOutputExecuted":"Processing error occurred."}
      implementationNames:
+        {"0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c":"Application"}
    }
```

```diff
    contract ERC20Portal (0xc700D6aDd016eECd59d989C028214Eaa0fCC0051) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      name:
+        "ERC20Portal"
      sourceHashes:
+        ["0x4d9461f610606f687a0d0180aa13890df326becb8f2e8ff8acdd713c311ceae9"]
      sinceTimestamp:
+        1748610923
      sinceBlock:
+        22595782
      values:
+        {"$immutable":true,"getInputBox":"0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"}
      implementationNames:
+        {"0xc700D6aDd016eECd59d989C028214Eaa0fCC0051":"ERC20Portal"}
    }
```

```diff
+   Status: CREATED
    contract DaveConsensus (0x6CE590b9F0697327f18c601DF6f0baE4a0801B68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiLevelTournamentFactory (0xA31C2aCfF3464658866960c0fBD3d798310272D7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InputBox (0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TopTournament (0xDaa497885D83f345CBcbF071d7201230A8CBd68A)
    +++ description: None
```

## Source code changes

```diff
.../honeypot/ethereum/.flat/Application.sol        |  881 ++++++++++
 .../honeypot/ethereum/.flat/DaveConsensus.sol      |  866 ++++++++++
 .../honeypot/ethereum/.flat/ERC20Portal.sol        |  191 +++
 .../projects/honeypot/ethereum/.flat/InputBox.sol  |  121 ++
 .../ethereum/.flat/MultiLevelTournamentFactory.sol |  351 ++++
 .../ethereum/.flat/TopTournament/TopTournament.sol | 1793 ++++++++++++++++++++
 6 files changed, 4203 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641250 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366)
    +++ description: None
```

```diff
-   Status: DELETED
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Cartesi Token (0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D)
    +++ description: None
```

Generated with discovered.json: 0x63e589b2600cc6775a648f35563f9ce704673f68

# Diff at Tue, 04 Mar 2025 10:39:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20641250
- current block number: 20641250

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641250 (main branch discovery), not current.

```diff
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    +++ description: None
      sinceBlock:
+        18122866
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    +++ description: None
      sinceBlock:
+        18114934
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      sinceBlock:
+        17784733
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      sinceBlock:
+        17784735
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    +++ description: None
      sinceBlock:
+        18114898
    }
```

Generated with discovered.json: 0x5abdeba1ee48213a6d3f5f71d7921f2390eae052

# Diff at Mon, 14 Oct 2024 10:51:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20641250
- current block number: 20641250

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641250 (main branch discovery), not current.

```diff
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    +++ description: None
      sourceHashes:
+        ["0x4ea587588e6035764e827917418aee9c41a353454a7a13fe807ca56724350d47"]
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    +++ description: None
      sourceHashes:
+        ["0x10336484f22cf6f3d30e974fe43a4aa644807bee582c7ee3c03b116024554eaa"]
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      sourceHashes:
+        ["0x3bfaa3fe125375dfb9181df0c144cda2b17aa368e57292e88d6258c4aafe51ed"]
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      sourceHashes:
+        ["0x0cb29769a693a89712c9c05a29f52a6e610ed38585db5d66f1fc56118e39493d"]
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    +++ description: None
      sourceHashes:
+        ["0xe4cf627ec9b7ed3b6b18711555d50a7002525d34e84a6242a2b1bd41aedb2f11"]
    }
```

Generated with discovered.json: 0xd19b552af376e49c0192968c5239b300c6593010

# Diff at Wed, 27 Sep 2023 11:44:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@dfa2bd4412e533f776bc670a6d67f61293446c02

```diff
    contract CartesiDApp (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
      name:
-        "CartesiDApp"
+        "Honeypot"
      derivedName:
+        "CartesiDApp"
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
      derivedName:
+        "History"
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
      derivedName:
+        "InputBox"
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
      derivedName:
+        "ERC20Portal"
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
      derivedName:
+        "Authority"
    }
```

# Diff at Wed, 27 Sep 2023 09:05:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Watched changes

```diff
+   Status: CREATED
    contract CartesiDApp (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    }
```

```diff
+   Status: CREATED
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    }
```

```diff
+   Status: CREATED
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    }
```

```diff
+   Status: CREATED
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    }
```

```diff
+   Status: CREATED
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    }
```
