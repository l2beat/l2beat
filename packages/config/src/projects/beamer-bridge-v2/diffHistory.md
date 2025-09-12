Generated with discovered.json: 0x37237e046fecfef76b1919584541f18d3a21ecaf

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x1e68801f88eac00ad560700d2a2abf0fdf86df27

# Diff at Mon, 14 Jul 2025 12:44:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 19531448
- current block number: 19531448

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531448 (main branch discovery), not current.

```diff
    contract EthereumL1Messenger (0x12B8489913E2afBCed131d52c345C380BBB65baf) {
    +++ description: None
      address:
-        "0x12B8489913E2afBCed131d52c345C380BBB65baf"
+        "eth:0x12B8489913E2afBCed131d52c345C380BBB65baf"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      implementationNames.0x12B8489913E2afBCed131d52c345C380BBB65baf:
-        "EthereumL1Messenger"
      implementationNames.eth:0x12B8489913E2afBCed131d52c345C380BBB65baf:
+        "EthereumL1Messenger"
    }
```

```diff
    contract EthereumL2Messenger (0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da) {
    +++ description: None
      address:
-        "0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da"
+        "eth:0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      values.resolver:
-        "0xCb60516819a28431233195A8b7E0227C288B61AD"
+        "eth:0xCb60516819a28431233195A8b7E0227C288B61AD"
      implementationNames.0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da:
-        "EthereumL2Messenger"
      implementationNames.eth:0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da:
+        "EthereumL2Messenger"
    }
```

```diff
    EOA  (0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70) {
    +++ description: None
      address:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
    }
```

```diff
    contract OptimismL1Messenger (0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34) {
    +++ description: None
      address:
-        "0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34"
+        "eth:0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34"
      values.nativeMessenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      implementationNames.0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34:
-        "OptimismL1Messenger"
      implementationNames.eth:0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34:
+        "OptimismL1Messenger"
    }
```

```diff
    contract ArbitrumL1Messenger (0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3) {
    +++ description: None
      address:
-        "0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3"
+        "eth:0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3"
      values.bridge:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      values.inbox:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      implementationNames.0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3:
-        "ArbitrumL1Messenger"
      implementationNames.eth:0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3:
+        "ArbitrumL1Messenger"
    }
```

```diff
    contract EthereumRequestManager (0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50) {
    +++ description: None
      address:
-        "0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50"
+        "eth:0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      implementationNames.0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50:
-        "RequestManager"
      implementationNames.eth:0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50:
+        "RequestManager"
    }
```

```diff
    contract Resolver (0xCb60516819a28431233195A8b7E0227C288B61AD) {
    +++ description: None
      address:
-        "0xCb60516819a28431233195A8b7E0227C288B61AD"
+        "eth:0xCb60516819a28431233195A8b7E0227C288B61AD"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      implementationNames.0xCb60516819a28431233195A8b7E0227C288B61AD:
-        "Resolver"
      implementationNames.eth:0xCb60516819a28431233195A8b7E0227C288B61AD:
+        "Resolver"
    }
```

```diff
    contract EthereumFillManager (0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29) {
    +++ description: None
      address:
-        "0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29"
+        "eth:0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29"
      values.l1Resolver:
-        "0xCb60516819a28431233195A8b7E0227C288B61AD"
+        "eth:0xCb60516819a28431233195A8b7E0227C288B61AD"
      values.liquidityProviders.0:
-        "0xdC256EC77E97448d29D88118e55C82067150b768"
+        "eth:0xdC256EC77E97448d29D88118e55C82067150b768"
      values.messenger:
-        "0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da"
+        "eth:0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da"
      values.owner:
-        "0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
+        "eth:0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70"
      implementationNames.0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29:
-        "FillManager"
      implementationNames.eth:0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29:
+        "FillManager"
    }
```

```diff
    EOA  (0xdC256EC77E97448d29D88118e55C82067150b768) {
    +++ description: None
      address:
-        "0xdC256EC77E97448d29D88118e55C82067150b768"
+        "eth:0xdC256EC77E97448d29D88118e55C82067150b768"
    }
```

```diff
+   Status: CREATED
    contract EthereumL1Messenger (0x12B8489913E2afBCed131d52c345C380BBB65baf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumL2Messenger (0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismL1Messenger (0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL1Messenger (0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumRequestManager (0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Resolver (0xCb60516819a28431233195A8b7E0227C288B61AD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumFillManager (0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29)
    +++ description: None
```

Generated with discovered.json: 0x31bc85104a5f5cc63ba7a6830f0e9ac0161ed95f

# Diff at Tue, 04 Mar 2025 10:38:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19531448
- current block number: 19531448

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531448 (main branch discovery), not current.

```diff
    contract EthereumL1Messenger (0x12B8489913E2afBCed131d52c345C380BBB65baf) {
    +++ description: None
      sinceBlock:
+        16946577
    }
```

```diff
    contract EthereumL2Messenger (0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da) {
    +++ description: None
      sinceBlock:
+        16946578
    }
```

```diff
    contract OptimismL1Messenger (0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34) {
    +++ description: None
      sinceBlock:
+        16946597
    }
```

```diff
    contract ArbitrumL1Messenger (0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3) {
    +++ description: None
      sinceBlock:
+        16946592
    }
```

```diff
    contract EthereumRequestManager (0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50) {
    +++ description: None
      sinceBlock:
+        16946579
    }
```

```diff
    contract Resolver (0xCb60516819a28431233195A8b7E0227C288B61AD) {
    +++ description: None
      sinceBlock:
+        16946576
    }
```

```diff
    contract EthereumFillManager (0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29) {
    +++ description: None
      sinceBlock:
+        16946583
    }
```

Generated with discovered.json: 0x694551c12c748660effc646785da1cbc5075c4f5

# Diff at Mon, 14 Oct 2024 10:49:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531448
- current block number: 19531448

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531448 (main branch discovery), not current.

```diff
    contract EthereumL1Messenger (0x12B8489913E2afBCed131d52c345C380BBB65baf) {
    +++ description: None
      sourceHashes:
+        ["0x53a70d11cd7796a36186bc6faf5761365984bd862be2a0a8e30f96d0510e40bc"]
    }
```

```diff
    contract EthereumL2Messenger (0x3222C9a1e5d7856FCBc551A30a63634e7Fd634Da) {
    +++ description: None
      sourceHashes:
+        ["0x8ce69cb7eef1745342d1a5730155558e6a15cf3530e4d28816fb4d7c7301cea9"]
    }
```

```diff
    contract OptimismL1Messenger (0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34) {
    +++ description: None
      sourceHashes:
+        ["0x4b9b7280455da961659b45ac59c98334d9cef746991718d2ec48b8e9a90a69d3"]
    }
```

```diff
    contract ArbitrumL1Messenger (0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3) {
    +++ description: None
      sourceHashes:
+        ["0x95eb429107814a5f14a897acd61975d017790ae60ad9314ae5e35524a3ec1a5c"]
    }
```

```diff
    contract EthereumRequestManager (0x7faEa6562a6cE991149F0167baF283E9aAc7Dc50) {
    +++ description: None
      sourceHashes:
+        ["0xa82fa8fc1e5ff96f0cfb766de691af0d8f797facacd18dd6b472ac890c1f9ab9"]
    }
```

```diff
    contract Resolver (0xCb60516819a28431233195A8b7E0227C288B61AD) {
    +++ description: None
      sourceHashes:
+        ["0x6f0996aaa83416e4ef529a91847760e8b44f88c827adfeb579723ed0b708cbf3"]
    }
```

```diff
    contract EthereumFillManager (0xD5EF34B499b6d64817CC70C3b0B8D9f807F06C29) {
    +++ description: None
      sourceHashes:
+        ["0xb8bd718248dbf8a521e10a055b52eb5ddcf6ddedf62a4259dbdf50574289ea5b"]
    }
```

