Generated with discovered.json: 0x419cb3d40447214146cdadae5b98d3f3d019e01b

# Diff at Tue, 01 Oct 2024 10:54:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20017695
- current block number: 20017695

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20017695 (main branch discovery), not current.

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-14T07:19:11.000Z",["0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"]],["2024-06-04T04:22:47.000Z",["0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"]]]
    }
```

```diff
    contract Gateway (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-03-02T19:54:40.000Z",["0x59C38B3A349BCf7e46b024Cddfb4778229609C28"]],["2022-04-28T16:27:39.000Z",["0xBD3e8d41874bC123fB6913a2a6c6C8984c71876c"]],["2022-05-09T17:27:03.000Z",["0xBc421722aDd7AD3cF23e7BbEFE709330bbfD6188"]],["2022-06-09T01:50:50.000Z",["0x46E1F8E746ee9037fA42b3a718dcE6c36CB3f16f"]],["2022-08-29T17:23:40.000Z",["0x212207006e5Ae344481Fa34a6F4960EB0f302Ff5"]],["2022-12-08T00:29:47.000Z",["0xEd9938294aCF9EE52D097133CA2cAafF0C804F16"]],["2023-10-23T21:13:23.000Z",["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]],["2023-10-24T06:02:35.000Z",["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]],["2023-10-29T02:12:23.000Z",["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]]]
      values.$upgradeCount:
+        9
    }
```

Generated with discovered.json: 0x9d710cdd924be52ffd8993451325b15ef74f197b

# Diff at Fri, 23 Aug 2024 09:54:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20017695
- current block number: 20017695

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20017695 (main branch discovery), not current.

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x668ae87395d544cbbd7167c9cd291c389978ee71

# Diff at Wed, 21 Aug 2024 10:05:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20017695
- current block number: 20017695

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20017695 (main branch discovery), not current.

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05","via":[]}]
    }
```

Generated with discovered.json: 0xe1d52d9325a3b730102151b7a4f0f7c8495a8479

# Diff at Tue, 04 Jun 2024 09:54:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@35cc9bbe2a9c9163e503882bcb76877c4909bbc9 block: 19118480
- current block number: 20017695

## Description

Added the AxelarGasService, which allows users to pay for native gas at the destination with tokens or ETH and manages refunds.

## Watched changes

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      upgradeability.implementation:
-        "0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"
+        "0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"
      implementations.0:
-        "0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"
+        "0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"
      values.implementation:
-        "0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"
+        "0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"
    }
```

## Source code changes

```diff
.../AxelarGasService/AxelarGasService.sol          | 437 ++++++++++++++++++++-
 1 file changed, 426 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19118480 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarGasServiceOperators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC)
    +++ description: None
```

Generated with discovered.json: 0x39326bef78b592a1264c16dbe875593764d55da2

# Diff at Fri, 26 Jan 2024 10:41:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 19090246

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Gateway (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    }
```

```diff
+   Status: CREATED
    contract TokenDeployer (0xb28478319B64f8D47e19A120209A211D902F8b8f) {
    }
```

```diff
+   Status: CREATED
    contract Multisig (0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68) {
    }
```

```diff
+   Status: CREATED
    contract AxelarAuthWeighted (0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) {
    }
```

```diff
+   Status: CREATED
    contract InterchainGovernance (0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) {
    }
```
