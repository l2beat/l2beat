Generated with discovered.json: 0x83b48b9c165db74deedcd7832d69cd8b0f175e28

# Diff at Fri, 17 Jan 2025 11:09:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9519f9f486064de9d488882e4ff83187f496daa3 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x7834eee0c00ff2ede2944dbdc6c7a1d9a38b154e

# Diff at Wed, 06 Nov 2024 12:10:20 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@569158b15e3821e66365edc31ada3588122315be block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
      issuedPermissions.0.via.0:
+        {"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC","delay":0}
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"}]
    }
```

Generated with discovered.json: 0x03496e6ab8129e2a79adcf97e5207bd330279a28

# Diff at Mon, 21 Oct 2024 11:15:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x01a6715d3560241E09E865a46122bf347A576c09"]
      values.$pastUpgrades.1.1:
-        ["0x01a6715d3560241E09E865a46122bf347A576c09"]
+        "0xa6bc022ba0f60ac6f10a6efb84b261e9ca1b327a611bdd7a1f4d37cc9b027a3c"
      values.$pastUpgrades.0.2:
+        ["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]
      values.$pastUpgrades.0.1:
-        ["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]
+        "0x5bfce59c2ad18019ef20d58a3f1ec496cdc85537fc9564c932f7dcbbb2a15b56"
    }
```

Generated with discovered.json: 0x2246a8aced604288721a8ed0d1148c84b6110e4b

# Diff at Mon, 14 Oct 2024 11:00:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: None
      sourceHashes:
+        ["0x3d8c2d3bcd396a14d951c81ad0c163139768c7439152292846ce2ef8a34affe8"]
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: None
      sourceHashes:
+        ["0x7132507bdacfea50a991d23f4b78d18a03a78fe5a265fd7a07397c4f6ce93399"]
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3a3b3a9708ad3a6179afe0f24a1426254e558d14bbaa4f155ed0db49027b2099"]
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: None
      sourceHashes:
+        ["0x82c5a05996248ee29f451f121ff0f973a3b17f7c7a8ed31878d30c5eaa51b245"]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

Generated with discovered.json: 0xf64431a2b31fceb223cd8c07679bebcb4755d352

# Diff at Tue, 01 Oct 2024 11:14:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-21T18:48:46.000Z",["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]],["2024-06-10T09:25:38.000Z",["0x01a6715d3560241E09E865a46122bf347A576c09"]]]
    }
```

Generated with discovered.json: 0x8280118b8556ab1e638dadc43c445dd09f499c68

# Diff at Fri, 13 Sep 2024 15:33:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 44113900

## Description

Initial discovery: Added the three token governance contracts for the shared ZK stack (including the main ProtocolGov contract that acts through L1) and their timelocks. Wrote event alerts for all three contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC)
    +++ description: None
```
