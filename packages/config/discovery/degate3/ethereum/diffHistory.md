Generated with discovered.json: 0xdf7aa946815766876f98f412948ee2549f83f871

# Diff at Tue, 04 Mar 2025 10:39:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21394291
- current block number: 21394291

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21394291 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      sinceBlock:
+        18552614
    }
```

```diff
    contract Multisig2 (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    +++ description: None
      sinceBlock:
+        17285500
    }
```

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      sinceBlock:
+        18552104
    }
```

```diff
    contract Multisig1 (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    +++ description: None
      sinceBlock:
+        11970338
    }
```

```diff
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC) {
    +++ description: None
      sinceBlock:
+        18552049
    }
```

```diff
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD) {
    +++ description: None
      sinceBlock:
+        18552106
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      sinceBlock:
+        18552105
    }
```

```diff
    contract BlockVerifier (0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6) {
    +++ description: None
      sinceBlock:
+        18552036
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      sinceBlock:
+        18552636
    }
```

Generated with discovered.json: 0xdced21b761e08817918ce1b96344ec1682832f56

# Diff at Mon, 20 Jan 2025 11:09:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21394291
- current block number: 21394291

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21394291 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x9C07A72177c5A05410cA338823e790876E79D73B"
      receivedPermissions.0.from:
+        "0x9C07A72177c5A05410cA338823e790876E79D73B"
    }
```

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf2991507952d9594E71A44A54fb19f3109D213A5"
      issuedPermissions.0.to:
+        "0xf2991507952d9594E71A44A54fb19f3109D213A5"
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
      issuedPermissions.0.to:
+        "0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x54D7aE423Edb07282645e740C046B9373970a168"
      receivedPermissions.0.from:
+        "0x54D7aE423Edb07282645e740C046B9373970a168"
    }
```

Generated with discovered.json: 0x2f5ff9403f5b0ceba03cfcc60518cca1105fba5f

# Diff at Fri, 13 Dec 2024 14:49:01 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@057a0310a9622d3c37d8b5e224c59b5dbd3a0507 block: 21386590
- current block number: 21394291

## Description

Discovery refresh. 

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21386590 (main branch discovery), not current.

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]
      values.$pastUpgrades.0.1:
+        "0xb1e5bc43a9a516618be17e0075ca12b7420b5daa42e377af2906a2c8d9619bdc"
      values.$pastUpgrades.0.0:
-        ["2023-11-11T23:57:23.000Z","0xb1e5bc43a9a516618be17e0075ca12b7420b5daa42e377af2906a2c8d9619bdc",["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]]
+        "2023-11-11T23:57:23.000Z"
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]
      values.$pastUpgrades.0.1:
+        "0x618d6d6bdaa4be3257aa4c695f9c10806e261f0e9759fc3133a5798fed43c062"
      values.$pastUpgrades.0.0:
-        ["2023-11-11T23:56:59.000Z","0x618d6d6bdaa4be3257aa4c695f9c10806e261f0e9759fc3133a5798fed43c062",["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]]
+        "2023-11-11T23:56:59.000Z"
    }
```

Generated with discovered.json: 0xb5875a416bbdd56d85843d2622665c30797be502

# Diff at Thu, 12 Dec 2024 13:02:19 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 18939732
- current block number: 21386590

## Description

Refresh discovery. Contract has not changed.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      values.$pastUpgrades.0.2:
-        ["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]
      values.$pastUpgrades.0.1:
-        "0xb1e5bc43a9a516618be17e0075ca12b7420b5daa42e377af2906a2c8d9619bdc"
      values.$pastUpgrades.0.0:
-        "2023-11-11T23:57:23.000Z"
+        ["2023-11-11T23:57:23.000Z","0xb1e5bc43a9a516618be17e0075ca12b7420b5daa42e377af2906a2c8d9619bdc",["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]]
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      values.$pastUpgrades.0.2:
-        ["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]
      values.$pastUpgrades.0.1:
-        "0x618d6d6bdaa4be3257aa4c695f9c10806e261f0e9759fc3133a5798fed43c062"
      values.$pastUpgrades.0.0:
-        "2023-11-11T23:56:59.000Z"
+        ["2023-11-11T23:56:59.000Z","0x618d6d6bdaa4be3257aa4c695f9c10806e261f0e9759fc3133a5798fed43c062",["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]]
    }
```

Generated with discovered.json: 0xdef5a9fbe57f50db67d090afb663c692ff4c5ec3

# Diff at Mon, 21 Oct 2024 11:05:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 18939732
- current block number: 18939732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]
      values.$pastUpgrades.0.1:
-        ["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]
+        "0xb1e5bc43a9a516618be17e0075ca12b7420b5daa42e377af2906a2c8d9619bdc"
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]
      values.$pastUpgrades.0.1:
-        ["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]
+        "0x618d6d6bdaa4be3257aa4c695f9c10806e261f0e9759fc3133a5798fed43c062"
    }
```

Generated with discovered.json: 0x0a287cd83e7b82c8e6aca364356dd636a1878514

# Diff at Mon, 14 Oct 2024 10:50:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 18939732
- current block number: 18939732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      sourceHashes:
+        ["0x9e2584b52fbf6729573afbb5c1cbab7d1159455f10d4de2a581c460e49852e70"]
    }
```

```diff
    contract Multisig2 (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    +++ description: None
      sourceHashes:
+        ["0xf716f94059215d0e4c8d8edf41e5a65e741bce5005c2afee04eaafcf5c210d20"]
    }
```

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      sourceHashes:
+        ["0x09274cec6469e731822a31ef5a200ae33fc319aca366cf599f707b6359f97613","0x84fb4e2bbd657c64908e8875c1bbe3610271899626eaf9cf56d6b69400a607b3"]
    }
```

```diff
    contract Multisig1 (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    +++ description: None
      sourceHashes:
+        ["0xf716f94059215d0e4c8d8edf41e5a65e741bce5005c2afee04eaafcf5c210d20"]
    }
```

```diff
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC) {
    +++ description: None
      sourceHashes:
+        ["0x1a927b8a2febc8b60253ee7277d887fe95ec3e23241d77d0ec9e6f424239438e"]
    }
```

```diff
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD) {
    +++ description: None
      sourceHashes:
+        ["0x80a64d522f935661e6a91ce240c8fab04db5aa499462cca019fcda5e0494b18e"]
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      sourceHashes:
+        ["0x09274cec6469e731822a31ef5a200ae33fc319aca366cf599f707b6359f97613","0x0eb913bdd3a56c7e954cf0d749fde579620dce50157f8736c1938de91acd7127"]
    }
```

```diff
    contract BlockVerifier (0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6) {
    +++ description: None
      sourceHashes:
+        ["0x1154ee2a46fb0e5586723354429b36343227a2e36a12e518d7e985031b67695d"]
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      sourceHashes:
+        ["0x9e2584b52fbf6729573afbb5c1cbab7d1159455f10d4de2a581c460e49852e70"]
    }
```

Generated with discovered.json: 0x68c2def71eb8a3e6ca2256bc56c9460090f68a93

# Diff at Tue, 01 Oct 2024 10:50:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 18939732
- current block number: 18939732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-11T23:57:23.000Z",["0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-11T23:56:59.000Z",["0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x8e2fb63b55f665c95e092b526b35892243f70df8

# Diff at Fri, 30 Aug 2024 07:51:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 18939732
- current block number: 18939732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xa39b752f64ddd182ee60a0f233fb4a905d5f476a

# Diff at Wed, 21 Aug 2024 10:02:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 18939732
- current block number: 18939732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x9C07A72177c5A05410cA338823e790876E79D73B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x9C07A72177c5A05410cA338823e790876E79D73B","via":[]}]
    }
```

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf2991507952d9594E71A44A54fb19f3109D213A5","via":[]}]
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d","via":[]}]
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x54D7aE423Edb07282645e740C046B9373970a168"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x54D7aE423Edb07282645e740C046B9373970a168","via":[]}]
    }
```

Generated with discovered.json: 0xa0bf6f1e7cabe7313c5d6074abd9e954b94bb880

# Diff at Fri, 09 Aug 2024 10:09:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 18939732
- current block number: 18939732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939732 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x9C07A72177c5A05410cA338823e790876E79D73B"]
      assignedPermissions.upgrade:
+        ["0x9C07A72177c5A05410cA338823e790876E79D73B"]
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x54D7aE423Edb07282645e740C046B9373970a168"]
      assignedPermissions.upgrade:
+        ["0x54D7aE423Edb07282645e740C046B9373970a168"]
    }
```

Generated with discovered.json: 0xfc59701f91a4e00fbe20bec82c6713d916a2f155

# Diff at Fri, 05 Jan 2024 07:55:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c161bc667faec740460d4a22b06cd4ecc322dbfd

## Description

The owner has accepted the ownership of the contract, which is now the same multisig used for upgrades. The EOA that was there before is now only the owner of the BlockVerifier, but it has no power since all the methods with the `onlyOwner` modifier have been deleted from Loopring's original codebase.

## Watched changes

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC) {
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD) {
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "0x0000000000000000000000000000000000000000"
    }
```

# Diff at Thu, 21 Dec 2023 13:24:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10f854f818ad64712b787aaf697a6953e41185cf

## Description

Owner is being changed. They are using Claimable instead of Ownable, which is the same thing but the new pending owner has to accept the ownership.

## Watched changes

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
    }
```

```diff
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC) {
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
    }
```

```diff
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD) {
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
    }
```

# Diff at Tue, 21 Nov 2023 13:17:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    }
```

```diff
+   Status: CREATED
    contract Multisig2 (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    }
```

```diff
+   Status: CREATED
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    }
```

```diff
+   Status: CREATED
    contract Multisig1 (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    }
```

```diff
+   Status: CREATED
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC) {
    }
```

```diff
+   Status: CREATED
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD) {
    }
```

```diff
+   Status: CREATED
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    }
```

```diff
+   Status: CREATED
    contract BlockVerifier (0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6) {
    }
```

```diff
+   Status: CREATED
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    }
```
