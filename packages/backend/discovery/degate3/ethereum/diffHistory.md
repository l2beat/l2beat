Generated with discovered.json: 0x90af3db46da30c8d165db2f08a73466fab6e1afb

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
