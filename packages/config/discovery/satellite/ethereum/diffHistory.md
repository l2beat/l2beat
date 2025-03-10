Generated with discovered.json: 0x2282befed158adbf0ba817649fd870514f6e5ae3

# Diff at Tue, 04 Mar 2025 10:39:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20017695
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
      sinceBlock:
+        15448318
    }
```

```diff
    contract Gateway (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    +++ description: None
      sinceBlock:
+        13857570
    }
```

```diff
    contract AxelarGasServiceOperators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) {
    +++ description: None
      sinceBlock:
+        18782489
    }
```

```diff
    contract TokenDeployer (0xb28478319B64f8D47e19A120209A211D902F8b8f) {
    +++ description: None
      sinceBlock:
+        18389965
    }
```

```diff
    contract Multisig (0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68) {
    +++ description: None
      sinceBlock:
+        18388582
    }
```

```diff
    contract AxelarAuthWeighted (0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) {
    +++ description: None
      sinceBlock:
+        18389964
    }
```

```diff
    contract InterchainGovernance (0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) {
    +++ description: None
      sinceBlock:
+        18394640
    }
```

Generated with discovered.json: 0x3bf39cc365df5aa2ae1730c7ca49f5e92c559a1c

# Diff at Mon, 20 Jan 2025 11:10:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20017695
- current block number: 20017695

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20017695 (main branch discovery), not current.

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
      issuedPermissions.0.to:
+        "0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

Generated with discovered.json: 0x1a15de762043b103a1da21d4b70f5c03f560ebba

# Diff at Mon, 21 Oct 2024 11:09:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20017695
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
      values.$pastUpgrades.1.2:
+        ["0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"]
      values.$pastUpgrades.1.1:
-        ["0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"]
+        "0x89d167023ab2edd2f46e1c80f09118d7ab37362d845b2a9a781ec97eaa5c6563"
      values.$pastUpgrades.0.2:
+        ["0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"]
      values.$pastUpgrades.0.1:
-        ["0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"]
+        "0xfc2554f725e599e45041529be0d88fd97508a5d3fb043cd26fc93a0bb45bf887"
    }
```

```diff
    contract Gateway (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    +++ description: None
      values.$pastUpgrades.8.2:
+        ["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]
      values.$pastUpgrades.8.1:
-        ["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]
+        "0x5f29d6eccb046d7d92d563231170f817e8a942f76106a86e5defe79d9d00ff19"
      values.$pastUpgrades.7.2:
+        ["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]
      values.$pastUpgrades.7.1:
-        ["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]
+        "0x4b3d43d30af4c0ceafe04e65253a137f8c7cfe58c266bc4f9b580b122621d17b"
      values.$pastUpgrades.6.2:
+        ["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]
      values.$pastUpgrades.6.1:
-        ["0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"]
+        "0x23e155b748b569a1c7b26692ccef22da39a65a0cc7b3214e7a5bd1a8bfb518a9"
      values.$pastUpgrades.5.2:
+        ["0xEd9938294aCF9EE52D097133CA2cAafF0C804F16"]
      values.$pastUpgrades.5.1:
-        ["0xEd9938294aCF9EE52D097133CA2cAafF0C804F16"]
+        "0xa75765b7fbdc94a8625940f66bcce34423d5ed463e6cc5cc129770814b5f3e98"
      values.$pastUpgrades.4.2:
+        ["0x212207006e5Ae344481Fa34a6F4960EB0f302Ff5"]
      values.$pastUpgrades.4.1:
-        ["0x212207006e5Ae344481Fa34a6F4960EB0f302Ff5"]
+        "0x7d2d73f72a273a7f8995744d8a4737c14b128d2df15318d632bb7452a1ef5fc2"
      values.$pastUpgrades.3.2:
+        ["0x46E1F8E746ee9037fA42b3a718dcE6c36CB3f16f"]
      values.$pastUpgrades.3.1:
-        ["0x46E1F8E746ee9037fA42b3a718dcE6c36CB3f16f"]
+        "0x5344ca726c0a87185bb2e124398f230cb3353765834f554b32539e22dd71a12e"
      values.$pastUpgrades.2.2:
+        ["0xBc421722aDd7AD3cF23e7BbEFE709330bbfD6188"]
      values.$pastUpgrades.2.1:
-        ["0xBc421722aDd7AD3cF23e7BbEFE709330bbfD6188"]
+        "0x78ced8b5edfc79dad979666b40c5c19224c265fcf8e559bea2078f69c2d1ee3f"
      values.$pastUpgrades.1.2:
+        ["0xBD3e8d41874bC123fB6913a2a6c6C8984c71876c"]
      values.$pastUpgrades.1.1:
-        ["0xBD3e8d41874bC123fB6913a2a6c6C8984c71876c"]
+        "0x50848f5e6afe00c30b6911c95de896725aa453e51f5bf941d484c5eee113cb33"
      values.$pastUpgrades.0.2:
+        ["0x59C38B3A349BCf7e46b024Cddfb4778229609C28"]
      values.$pastUpgrades.0.1:
-        ["0x59C38B3A349BCf7e46b024Cddfb4778229609C28"]
+        "0x680f83631a2288b45997619247b9b8f385dcf80fdec5bba479c4fce26ea8e6e7"
    }
```

Generated with discovered.json: 0xf64dea4536430bf44fd1d38e3ef785b82946a786

# Diff at Mon, 14 Oct 2024 10:55:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20017695
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
      sourceHashes:
+        ["0x8fa191bfa9dc72a70e40c3074333b73f30f8db135dc11d16443f6f26a079ddfe","0xffdc4806ed0369d49b542adf6eb3b3572e0f76d44bda8f0a093467ebcbe225df"]
    }
```

```diff
    contract Gateway (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    +++ description: None
      sourceHashes:
+        ["0xe65732e356e64373f949ce1e543c2af7a89f91a8e3e8337cf9b83a3cd6ae9082","0x5247a49385cad8b341a34b9f96cde901c1b9567eeb27372b65747f673832df87"]
    }
```

```diff
    contract AxelarGasServiceOperators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) {
    +++ description: None
      sourceHashes:
+        ["0xa898c8df7706ef8117978fb0d8653aea9d509fa5e96475894390689c93b28187"]
    }
```

```diff
    contract TokenDeployer (0xb28478319B64f8D47e19A120209A211D902F8b8f) {
    +++ description: None
      sourceHashes:
+        ["0xb697944037f1be572b23ca3eabbb455b59abdb05b45851313635da227ccc52c3"]
    }
```

```diff
    contract Multisig (0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68) {
    +++ description: None
      sourceHashes:
+        ["0xfca353778b820ad49261c7887cf13ab259a89edab86eef4aeb90e1b2b2a948f5"]
    }
```

```diff
    contract AxelarAuthWeighted (0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) {
    +++ description: None
      sourceHashes:
+        ["0xc6735e0060a5046f6ed1ea96805049e3e5167271060aa505f72fbade315a82cb"]
    }
```

```diff
    contract InterchainGovernance (0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) {
    +++ description: None
      sourceHashes:
+        ["0x36106df3599f7c698c4c70652810248df4da03bd579b99553e2852b368632ff6"]
    }
```

Generated with discovered.json: 0xf88245b9d159fbebb8172c35cb99a4992a99ddc4

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
