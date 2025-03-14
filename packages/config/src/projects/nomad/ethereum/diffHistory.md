Generated with discovered.json: 0x24409ed0fbb44aec68a12374f96e3161bae23f43

# Diff at Tue, 04 Mar 2025 10:39:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21937195
- current block number: 21937195

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21937195 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    +++ description: None
      sinceBlock:
+        13983756
    }
```

```diff
    contract HomeUpgradeBeacon (0x063e871f8DB991CEAd34B557A00B157B360084cc) {
    +++ description: None
      sinceBlock:
+        13983742
    }
```

```diff
    contract ReplicaUpgradeBeacon (0x0876dFe4AcAe0e1c0a43302716483f5752298b71) {
    +++ description: None
      sinceBlock:
+        13983756
    }
```

```diff
    contract UpgradeBeaconProxy (0x0A6f564C5c9BeBD66F1595f1B51D1F3de6Ef3b79) {
    +++ description: None
      sinceBlock:
+        13983838
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    +++ description: None
      sinceBlock:
+        13983751
    }
```

```diff
    contract GovernanceUpgradeBeacon (0x67833a48b3F509d4252ac2c19cd604556eD6c981) {
    +++ description: None
      sinceBlock:
+        13983750
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    +++ description: None
      sinceBlock:
+        13983843
    }
```

```diff
    contract UpdaterManager (0x9272C9d5fa902Ef3804EC81e0333Ae420D57f715) {
    +++ description: None
      sinceBlock:
+        13983731
    }
```

```diff
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    +++ description: None
      sinceBlock:
+        13983742
    }
```

```diff
    contract Governor (0x93277b8f5939975b9E6694d5Fd2837143afBf68A) {
    +++ description: None
      sinceBlock:
+        13980892
    }
```

```diff
    contract UpgradeBeaconProxy (0xa4B86BcbB18639D8e708d6163a0c734aFcDB770c) {
    +++ description: None
      sinceBlock:
+        16076617
    }
```

```diff
    contract BridgeUpgradeBeacon (0xB70588b1A51F847d13158ff18E9Cac861dF5Fb00) {
    +++ description: None
      sinceBlock:
+        13983843
    }
```

```diff
    contract RecoveryManager (0xda2f881f7f4e9D2b9559F97c7670472A85C1986A) {
    +++ description: None
      sinceBlock:
+        13980925
    }
```

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      sinceBlock:
+        13983725
    }
```

```diff
    contract XAppConnectionManager (0xFe8874778f946Ac2990A29eba3CFd50760593B2F) {
    +++ description: None
      sinceBlock:
+        13983737
    }
```

Generated with discovered.json: 0x336132fefe2cb56f8b40b078cd071f128aa4d587

# Diff at Mon, 20 Jan 2025 11:09:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19531994
- current block number: 19531994

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
      issuedPermissions.0.to:
+        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
      issuedPermissions.0.to:
+        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
      issuedPermissions.0.to:
+        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
    }
```

```diff
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
      issuedPermissions.0.to:
+        "0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e"
    }
```

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      receivedPermissions.3.target:
-        "0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8"
      receivedPermissions.3.from:
+        "0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8"
      receivedPermissions.2.target:
-        "0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3"
      receivedPermissions.2.from:
+        "0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3"
      receivedPermissions.1.target:
-        "0x3009C99D370B780304D2098196f1EBF779a4777a"
      receivedPermissions.1.from:
+        "0x3009C99D370B780304D2098196f1EBF779a4777a"
      receivedPermissions.0.target:
-        "0x049b51e531Fd8f90da6d92EA83dC4125002F20EF"
      receivedPermissions.0.from:
+        "0x049b51e531Fd8f90da6d92EA83dC4125002F20EF"
    }
```

Generated with discovered.json: 0x8645f5918f6d368949ebc735907db38fc03671c1

# Diff at Mon, 21 Oct 2024 11:08:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x7f221A1850c12b57fed1f0831dd25399a13b68c2"]
      values.$pastUpgrades.2.1:
-        ["0x7f221A1850c12b57fed1f0831dd25399a13b68c2"]
+        "0x6795e8b0dc56aa4f3c7f1cc549b7c95efd97cb381f0d3227cce61c1700e9db65"
      values.$pastUpgrades.1.2:
+        ["0xB92336759618F55bd0F8313bd843604592E27bd8"]
      values.$pastUpgrades.1.1:
-        ["0xB92336759618F55bd0F8313bd843604592E27bd8"]
+        "0x7bccd64f4c4d5f6f545c2edf904857e6ddb460532fc0ac7eb5ac175cd21e56b1"
      values.$pastUpgrades.0.2:
+        ["0x7F58bb8311DB968AB110889F2Dfa04ab7E8E831B"]
      values.$pastUpgrades.0.1:
-        ["0x7F58bb8311DB968AB110889F2Dfa04ab7E8E831B"]
+        "0xfa18f505b85ddcf628daace22a887b59d6a65005975d0abcf71d33398d9984a7"
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xE9F0a0a787CEEA82f1c8fE7A783826eBD181e707"]
      values.$pastUpgrades.2.1:
-        ["0xE9F0a0a787CEEA82f1c8fE7A783826eBD181e707"]
+        "0x6795e8b0dc56aa4f3c7f1cc549b7c95efd97cb381f0d3227cce61c1700e9db65"
      values.$pastUpgrades.1.2:
+        ["0xfBea6D67DDd90E1f726C2622c6C42b016fDad5a7"]
      values.$pastUpgrades.1.1:
-        ["0xfBea6D67DDd90E1f726C2622c6C42b016fDad5a7"]
+        "0x7bccd64f4c4d5f6f545c2edf904857e6ddb460532fc0ac7eb5ac175cd21e56b1"
      values.$pastUpgrades.0.2:
+        ["0x569D80f7FC17316B4C83f072b92EF37B72819DE0"]
      values.$pastUpgrades.0.1:
-        ["0x569D80f7FC17316B4C83f072b92EF37B72819DE0"]
+        "0xa9005bc6bbfdb16ae648a796e15a1ebea3f62af29f617647bb1b3399dff1dfbe"
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xe0db61ac718f502B485DEc66D013afbbE0B52F84"]
      values.$pastUpgrades.2.1:
-        ["0xe0db61ac718f502B485DEc66D013afbbE0B52F84"]
+        "0x6795e8b0dc56aa4f3c7f1cc549b7c95efd97cb381f0d3227cce61c1700e9db65"
      values.$pastUpgrades.1.2:
+        ["0x15fdA9F60310d09FEA54E3c99d1197DfF5107248"]
      values.$pastUpgrades.1.1:
-        ["0x15fdA9F60310d09FEA54E3c99d1197DfF5107248"]
+        "0x7bccd64f4c4d5f6f545c2edf904857e6ddb460532fc0ac7eb5ac175cd21e56b1"
      values.$pastUpgrades.0.2:
+        ["0xD3dfD3eDe74E0DCEBC1AA685e151332857efCe2d"]
      values.$pastUpgrades.0.1:
-        ["0xD3dfD3eDe74E0DCEBC1AA685e151332857efCe2d"]
+        "0xbeb76185575a5352f7b9c9c2d302883fd092525e741f33434faea86af8bbcc7b"
    }
```

```diff
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xf3bb7e2d4B26ae2C3EAC41171840c227f457EA06"]
      values.$pastUpgrades.2.1:
-        ["0xf3bb7e2d4B26ae2C3EAC41171840c227f457EA06"]
+        "0x6795e8b0dc56aa4f3c7f1cc549b7c95efd97cb381f0d3227cce61c1700e9db65"
      values.$pastUpgrades.1.2:
+        ["0x1f98FDc4D8d0806eB3902d57df7a2183b333B80C"]
      values.$pastUpgrades.1.1:
-        ["0x1f98FDc4D8d0806eB3902d57df7a2183b333B80C"]
+        "0x7bccd64f4c4d5f6f545c2edf904857e6ddb460532fc0ac7eb5ac175cd21e56b1"
      values.$pastUpgrades.0.2:
+        ["0x8F184D6Aa1977fd2F9d9024317D0ea5cF5815b6f"]
      values.$pastUpgrades.0.1:
-        ["0x8F184D6Aa1977fd2F9d9024317D0ea5cF5815b6f"]
+        "0x04d115136ab73cee543d5ab5635aa11f085511306720cbd77c75f175b7713802"
    }
```

Generated with discovered.json: 0xe2749a0c5636c4dabe9894a68bfd5b82062587c2

# Diff at Mon, 14 Oct 2024 10:53:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0x5a213a8e0ec856d7338e82299deea6e024ae062e3529eba107f202a6d8600857"]
    }
```

```diff
    contract HomeUpgradeBeacon (0x063e871f8DB991CEAd34B557A00B157B360084cc) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract ReplicaUpgradeBeacon (0x0876dFe4AcAe0e1c0a43302716483f5752298b71) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract UpgradeBeaconProxy (0x0A6f564C5c9BeBD66F1595f1B51D1F3de6Ef3b79) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388"]
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0xa84df7e66da3df341f1c36dbdb91392d9fa74a77013330c97f73274f59d0be15"]
    }
```

```diff
    contract GovernanceUpgradeBeacon (0x67833a48b3F509d4252ac2c19cd604556eD6c981) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0x2e0076ec20cd768884b443f77a4c1a9b0e7532b23d3f961c0d2d3160f8057fe9"]
    }
```

```diff
    contract UpdaterManager (0x9272C9d5fa902Ef3804EC81e0333Ae420D57f715) {
    +++ description: None
      sourceHashes:
+        ["0x4ac3e27d1d1ef6c9a05335874ae7286f305ae29a71c239cd1095617d01efbaf0"]
    }
```

```diff
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0x49bd5136e54546da3f230903b88d542e5e2f6ceedb105ba13642063f86972ab3"]
    }
```

```diff
    contract Governor (0x93277b8f5939975b9E6694d5Fd2837143afBf68A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract UpgradeBeaconProxy (0xa4B86BcbB18639D8e708d6163a0c734aFcDB770c) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388"]
    }
```

```diff
    contract BridgeUpgradeBeacon (0xB70588b1A51F847d13158ff18E9Cac861dF5Fb00) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract RecoveryManager (0xda2f881f7f4e9D2b9559F97c7670472A85C1986A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      sourceHashes:
+        ["0x12e387edec9bf90c8c2ee351a4b607488ae3e01f861eb7dabbf3e4fdd078ad48"]
    }
```

```diff
    contract XAppConnectionManager (0xFe8874778f946Ac2990A29eba3CFd50760593B2F) {
    +++ description: None
      sourceHashes:
+        ["0xb64e5af8c508ce86c29728805a64c3b45bf37a0a28c4ea602902a3e23de80dfd"]
    }
```

Generated with discovered.json: 0x20c8527913daadd63afffc6f09d34810ac801796

# Diff at Tue, 01 Oct 2024 10:53:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-01-11T10:52:17.000Z",["0x7F58bb8311DB968AB110889F2Dfa04ab7E8E831B"]],["2022-06-21T18:39:29.000Z",["0xB92336759618F55bd0F8313bd843604592E27bd8"]],["2022-11-30T19:54:11.000Z",["0x7f221A1850c12b57fed1f0831dd25399a13b68c2"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-01-11T10:51:01.000Z",["0x569D80f7FC17316B4C83f072b92EF37B72819DE0"]],["2022-06-21T18:39:29.000Z",["0xfBea6D67DDd90E1f726C2622c6C42b016fDad5a7"]],["2022-11-30T19:54:11.000Z",["0xE9F0a0a787CEEA82f1c8fE7A783826eBD181e707"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-01-11T11:10:23.000Z",["0xD3dfD3eDe74E0DCEBC1AA685e151332857efCe2d"]],["2022-06-21T18:39:29.000Z",["0x15fdA9F60310d09FEA54E3c99d1197DfF5107248"]],["2022-11-30T19:54:11.000Z",["0xe0db61ac718f502B485DEc66D013afbbE0B52F84"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-01-11T10:50:10.000Z",["0x8F184D6Aa1977fd2F9d9024317D0ea5cF5815b6f"]],["2022-06-21T18:39:29.000Z",["0x1f98FDc4D8d0806eB3902d57df7a2183b333B80C"]],["2022-11-30T19:54:11.000Z",["0xf3bb7e2d4B26ae2C3EAC41171840c227f457EA06"]]]
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x8d448e942609b418809366f0f5c9f296a31f5644

# Diff at Fri, 30 Aug 2024 07:53:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xc9655da02b20f88d75ceba0e836e03821fe1ae8a

# Diff at Wed, 21 Aug 2024 10:04:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e","via":[]}]
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e","via":[]}]
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e","via":[]}]
    }
```

```diff
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e","via":[]}]
    }
```

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x049b51e531Fd8f90da6d92EA83dC4125002F20EF","0x3009C99D370B780304D2098196f1EBF779a4777a","0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3","0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x049b51e531Fd8f90da6d92EA83dC4125002F20EF","via":[]},{"permission":"upgrade","target":"0x3009C99D370B780304D2098196f1EBF779a4777a","via":[]},{"permission":"upgrade","target":"0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3","via":[]},{"permission":"upgrade","target":"0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8","via":[]}]
    }
```

Generated with discovered.json: 0x5e5c2ca6e95b3c533b0a8cad653967d6cba34192

# Diff at Fri, 09 Aug 2024 12:00:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x3009C99D370B780304D2098196f1EBF779a4777a"
+        "0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3"
      assignedPermissions.upgrade.1:
-        "0x049b51e531Fd8f90da6d92EA83dC4125002F20EF"
+        "0x3009C99D370B780304D2098196f1EBF779a4777a"
      assignedPermissions.upgrade.0:
-        "0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3"
+        "0x049b51e531Fd8f90da6d92EA83dC4125002F20EF"
    }
```

Generated with discovered.json: 0xd560f9aa71e57ff1aa8d90a56e7ef75c003bcf07

# Diff at Fri, 09 Aug 2024 10:10:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531994
- current block number: 19531994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531994 (main branch discovery), not current.

```diff
    contract Governor (0x93277b8f5939975b9E6694d5Fd2837143afBf68A) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x83865712c50f702fA4650C7fadEd90A54242046e","0x25270d2e6980C5b343C4866Aea904a9A9bCA733F","0xab0614cE8d53ea2c67B87f8ad4d8Fac7A4a516e5","0xC69b66cc2811B509829448FBFfb2553c4CBb627e","0x9bdD76b2a69Db43Fa695a10f5977b8FD891225f3"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x83865712c50f702fA4650C7fadEd90A54242046e","0x25270d2e6980C5b343C4866Aea904a9A9bCA733F","0xab0614cE8d53ea2c67B87f8ad4d8Fac7A4a516e5","0xC69b66cc2811B509829448FBFfb2553c4CBb627e","0x9bdD76b2a69Db43Fa695a10f5977b8FD891225f3"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract RecoveryManager (0xda2f881f7f4e9D2b9559F97c7670472A85C1986A) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xea24Ac04DEFb338CA8595C3750E20166F3b4998A","0xDE9cfb1216889Dee0cAB8afB04c63911427659E4","0xCc20f031B2F06374e4986Af33A36bDda55bed21d"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xea24Ac04DEFb338CA8595C3750E20166F3b4998A","0xDE9cfb1216889Dee0cAB8afB04c63911427659E4","0xCc20f031B2F06374e4986Af33A36bDda55bed21d"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x049b51e531Fd8f90da6d92EA83dC4125002F20EF","0x3009C99D370B780304D2098196f1EBF779a4777a","0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3","0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8"]
      assignedPermissions.upgrade:
+        ["0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3","0x049b51e531Fd8f90da6d92EA83dC4125002F20EF","0x3009C99D370B780304D2098196f1EBF779a4777a","0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8"]
    }
```

Generated with discovered.json: 0x6071b13c881b6bcf4396ed37c4cc0bc5d3397311

# Diff at Thu, 28 Mar 2024 10:25:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 18340273
- current block number: 19531994

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18340273 (main branch discovery), not current.

```diff
    contract Governor (0x93277b8f5939975b9E6694d5Fd2837143afBf68A) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract RecoveryManager (0xda2f881f7f4e9D2b9559F97c7670472A85C1986A) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x6e13c45d5dd44f156af0a170d664ab078ff2c8e3

# Diff at Fri, 13 Oct 2023 07:04:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@28e18077472448efd6132e6ee714b582cc1ee80b

## Description

Newly created contracts are the result of rediscovering the `upgradeBeacon` address.

## Watched changes

```diff
+   Status: CREATED
    contract HomeUpgradeBeacon (0x063e871f8DB991CEAd34B557A00B157B360084cc) {
    }
```

```diff
+   Status: CREATED
    contract ReplicaUpgradeBeacon (0x0876dFe4AcAe0e1c0a43302716483f5752298b71) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceUpgradeBeacon (0x67833a48b3F509d4252ac2c19cd604556eD6c981) {
    }
```

```diff
+   Status: CREATED
    contract BridgeUpgradeBeacon (0xB70588b1A51F847d13158ff18E9Cac861dF5Fb00) {
    }
```

# Diff at Mon, 09 Oct 2023 14:59:21 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract ReplicaBeaconProxy (0x049b51e531Fd8f90da6d92EA83dC4125002F20EF) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x0A6f564C5c9BeBD66F1595f1B51D1F3de6Ef3b79) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceRouterBeaconProxy (0x3009C99D370B780304D2098196f1EBF779a4777a) {
    }
```

```diff
+   Status: CREATED
    contract BridgeRouterBeaconProxy (0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3) {
    }
```

```diff
+   Status: CREATED
    contract UpdaterManager (0x9272C9d5fa902Ef3804EC81e0333Ae420D57f715) {
    }
```

```diff
+   Status: CREATED
    contract HomeBeaconProxy (0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8) {
    }
```

```diff
+   Status: CREATED
    contract Governor (0x93277b8f5939975b9E6694d5Fd2837143afBf68A) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0xa4B86BcbB18639D8e708d6163a0c734aFcDB770c) {
    }
```

```diff
+   Status: CREATED
    contract RecoveryManager (0xda2f881f7f4e9D2b9559F97c7670472A85C1986A) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0xFe8874778f946Ac2990A29eba3CFd50760593B2F) {
    }
```
