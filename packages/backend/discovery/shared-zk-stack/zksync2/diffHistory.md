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
