Generated with discovered.json: 0xbdf5a332de803620f2300a1c545968af6b81d343

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x01c1ea3bfda78f075d353253ca7defc17eb3a5e6

# Diff at Mon, 14 Jul 2025 12:44:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22796394
- current block number: 22796394

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22796394 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      address:
-        "0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
+        "eth:0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
      values.admin:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d:
-        "Timelock"
      implementationNames.eth:0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d:
+        "Timelock"
    }
```

```diff
    contract Multisig2 (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    +++ description: None
      address:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.getOwners.0:
-        "0xf5020ADf433645c451A4809eac0d6F680709f11B"
+        "eth:0xf5020ADf433645c451A4809eac0d6F680709f11B"
      values.getOwners.1:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
      values.getOwners.2:
-        "0xB7093FC2d926ADdE48122B70991fe68374879adf"
+        "eth:0xB7093FC2d926ADdE48122B70991fe68374879adf"
      values.getOwners.3:
-        "0xC715b8501039d3514787dC55BC09f89c293351e9"
+        "eth:0xC715b8501039d3514787dC55BC09f89c293351e9"
      values.getOwners.4:
-        "0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
+        "eth:0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
      values.getOwners.5:
-        "0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
+        "eth:0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
      implementationNames.0x2028834B2c0A36A918c10937EeA71BE4f932da52:
-        "MultiSigWallet"
      implementationNames.eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52:
+        "MultiSigWallet"
    }
```

```diff
    EOA  (0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb) {
    +++ description: None
      address:
-        "0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
+        "eth:0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
    }
```

```diff
    EOA  (0x4e3FE240B50A445fc6137a6363aC3593Af173b8a) {
    +++ description: None
      address:
-        "0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
+        "eth:0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
    }
```

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      address:
-        "0x54D7aE423Edb07282645e740C046B9373970a168"
+        "eth:0x54D7aE423Edb07282645e740C046B9373970a168"
      values.$admin:
-        "0xf2991507952d9594E71A44A54fb19f3109D213A5"
+        "eth:0xf2991507952d9594E71A44A54fb19f3109D213A5"
      values.$implementation:
-        "0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"
+        "eth:0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"
      values.$pastUpgrades.0.2.0:
-        "0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"
+        "eth:0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"
      values.exchange:
-        "0x9C07A72177c5A05410cA338823e790876E79D73B"
+        "eth:0x9C07A72177c5A05410cA338823e790876E79D73B"
      values.implementation:
-        "0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"
+        "eth:0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973"
      values.owner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proxyOwner:
-        "0xf2991507952d9594E71A44A54fb19f3109D213A5"
+        "eth:0xf2991507952d9594E71A44A54fb19f3109D213A5"
      implementationNames.0x54D7aE423Edb07282645e740C046B9373970a168:
-        "OwnedUpgradabilityProxy"
      implementationNames.0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973:
-        "DefaultDepositContract"
      implementationNames.eth:0x54D7aE423Edb07282645e740C046B9373970a168:
+        "OwnedUpgradabilityProxy"
      implementationNames.eth:0x8CCc06C4C3B2b06616EeE1B62F558f5b9C08f973:
+        "DefaultDepositContract"
    }
```

```diff
    EOA  (0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8) {
    +++ description: None
      address:
-        "0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
+        "eth:0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
    }
```

```diff
    contract Multisig1 (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    +++ description: None
      address:
-        "0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
+        "eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
      values.getOwners.0:
-        "0xf5020ADf433645c451A4809eac0d6F680709f11B"
+        "eth:0xf5020ADf433645c451A4809eac0d6F680709f11B"
      values.getOwners.1:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
      values.getOwners.2:
-        "0xB7093FC2d926ADdE48122B70991fe68374879adf"
+        "eth:0xB7093FC2d926ADdE48122B70991fe68374879adf"
      values.getOwners.3:
-        "0xC715b8501039d3514787dC55BC09f89c293351e9"
+        "eth:0xC715b8501039d3514787dC55BC09f89c293351e9"
      values.getOwners.4:
-        "0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
+        "eth:0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
      values.getOwners.5:
-        "0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
+        "eth:0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
      implementationNames.0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C:
-        "MultiSigWallet"
      implementationNames.eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C:
+        "MultiSigWallet"
    }
```

```diff
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC) {
    +++ description: None
      address:
-        "0x9385aCd9d78dFE854c543294770d0C94c2B07EDC"
+        "eth:0x9385aCd9d78dFE854c543294770d0C94c2B07EDC"
      values.blockVerifierAddress:
-        "0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6"
+        "eth:0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6"
      values.lrcAddress:
-        "0x53C8395465A84955c95159814461466053DedEDE"
+        "eth:0x53C8395465A84955c95159814461466053DedEDE"
      values.owner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.protocolFeeVault:
-        "0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
+        "eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
      implementationNames.0x9385aCd9d78dFE854c543294770d0C94c2B07EDC:
-        "LoopringV3"
      implementationNames.eth:0x9385aCd9d78dFE854c543294770d0C94c2B07EDC:
+        "LoopringV3"
    }
```

```diff
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD) {
    +++ description: None
      address:
-        "0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD"
+        "eth:0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD"
      values.blockSubmitters.0:
-        "0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
+        "eth:0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
      values.owner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.target:
-        "0x9C07A72177c5A05410cA338823e790876E79D73B"
+        "eth:0x9C07A72177c5A05410cA338823e790876E79D73B"
      implementationNames.0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD:
-        "LoopringIOExchangeOwner"
      implementationNames.eth:0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD:
+        "LoopringIOExchangeOwner"
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      address:
-        "0x9C07A72177c5A05410cA338823e790876E79D73B"
+        "eth:0x9C07A72177c5A05410cA338823e790876E79D73B"
      values.$admin:
-        "0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
+        "eth:0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
      values.$implementation:
-        "0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"
+        "eth:0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"
      values.$pastUpgrades.0.2.0:
-        "0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"
+        "eth:0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"
      values.getDepositContract:
-        "0x54D7aE423Edb07282645e740C046B9373970a168"
+        "eth:0x54D7aE423Edb07282645e740C046B9373970a168"
      values.implementation:
-        "0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"
+        "eth:0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b"
      values.loopringV3:
-        "0x9385aCd9d78dFE854c543294770d0C94c2B07EDC"
+        "eth:0x9385aCd9d78dFE854c543294770d0C94c2B07EDC"
      values.owner:
-        "0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD"
+        "eth:0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proxyOwner:
-        "0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
+        "eth:0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d"
      implementationNames.0x9C07A72177c5A05410cA338823e790876E79D73B:
-        "OwnedUpgradabilityProxy"
      implementationNames.0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b:
-        "ExchangeV3"
      implementationNames.eth:0x9C07A72177c5A05410cA338823e790876E79D73B:
+        "OwnedUpgradabilityProxy"
      implementationNames.eth:0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b:
+        "ExchangeV3"
    }
```

```diff
    EOA LoopringOwner (0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82) {
    +++ description: None
      address:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
    }
```

```diff
    EOA  (0xB7093FC2d926ADdE48122B70991fe68374879adf) {
    +++ description: None
      address:
-        "0xB7093FC2d926ADdE48122B70991fe68374879adf"
+        "eth:0xB7093FC2d926ADdE48122B70991fe68374879adf"
    }
```

```diff
    EOA  (0xC715b8501039d3514787dC55BC09f89c293351e9) {
    +++ description: None
      address:
-        "0xC715b8501039d3514787dC55BC09f89c293351e9"
+        "eth:0xC715b8501039d3514787dC55BC09f89c293351e9"
    }
```

```diff
    contract BlockVerifier (0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6) {
    +++ description: None
      address:
-        "0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6"
+        "eth:0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6"
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6:
-        "BlockVerifier"
      implementationNames.eth:0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6:
+        "BlockVerifier"
    }
```

```diff
    EOA  (0xeD530f3b8675B0a576DaAe64C004676c65368DfD) {
    +++ description: None
      address:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      address:
-        "0xf2991507952d9594E71A44A54fb19f3109D213A5"
+        "eth:0xf2991507952d9594E71A44A54fb19f3109D213A5"
      values.admin:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xf2991507952d9594E71A44A54fb19f3109D213A5:
-        "Timelock"
      implementationNames.eth:0xf2991507952d9594E71A44A54fb19f3109D213A5:
+        "Timelock"
    }
```

```diff
    EOA  (0xf5020ADf433645c451A4809eac0d6F680709f11B) {
    +++ description: None
      address:
-        "0xf5020ADf433645c451A4809eac0d6F680709f11B"
+        "eth:0xf5020ADf433645c451A4809eac0d6F680709f11B"
    }
```

```diff
+   Status: CREATED
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig2 (0x2028834B2c0A36A918c10937EeA71BE4f932da52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig1 (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LoopringV3 (0x9385aCd9d78dFE854c543294770d0C94c2B07EDC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LoopringIOExchangeOwner (0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlockVerifier (0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5)
    +++ description: None
```

Generated with discovered.json: 0x41c719a671d52cb8e276099b91ac094e7d8df909

# Diff at Fri, 04 Jul 2025 12:18:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22796394
- current block number: 22796394

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22796394 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x9C07A72177c5A05410cA338823e790876E79D73B"
+        "eth:0x9C07A72177c5A05410cA338823e790876E79D73B"
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x54D7aE423Edb07282645e740C046B9373970a168"
+        "eth:0x54D7aE423Edb07282645e740C046B9373970a168"
    }
```

Generated with discovered.json: 0xb3ebc1562bdf94963aedddd3799066185e0d1384

# Diff at Fri, 27 Jun 2025 14:33:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0486f9e4c91d499528f32792e73e81ff4cc57d2c block: 21394291
- current block number: 22796394

## Description

exchange shutdown, added headerwarn and milestone:

A system **shutdown** [was triggered](https://etherscan.io/tx/0xa3a340cfebbdbf9999e61cc3838f67d21610944704f9b2546e2fe95435134d5c#eventlog) on 2025-06-27. This irreversible action freezes the L2 state and allows users to withdraw their funds with the help of the operator. Degate announced that they [will withdraw all funds automatically](https://medium.com/degate/announcement-sunsetting-of-orderbook-f9c0d3389e51). If the operator does not cooperate, a withdrawal mode can still be activated, allowing users to withdraw their funds on their own by providing merkle proofs.

## Watched changes

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      values.isShutdown:
-        false
+        true
      values.shutdownTriggered.0:
+        1750935659
    }
```

Generated with discovered.json: 0x5761dd4b68fa462199c4ee8ee54884af117403f4

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21394291
- current block number: 21394291

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21394291 (main branch discovery), not current.

```diff
    contract TimeLock1 (0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract TimeLock2 (0xf2991507952d9594E71A44A54fb19f3109D213A5) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x52a1934a968c35eeef3467d51b2533d70b982111

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21394291
- current block number: 21394291

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21394291 (main branch discovery), not current.

```diff
    contract DefaultDepositContract (0x54D7aE423Edb07282645e740C046B9373970a168) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xf2991507952d9594E71A44A54fb19f3109D213A5","via":[]}]
    }
```

```diff
    contract ExchangeV3 (0x9C07A72177c5A05410cA338823e790876E79D73B) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x0D2eC0a5858730E7D49f5B4aE6f2C665e46c1d9d","via":[]}]
    }
```

Generated with discovered.json: 0xd0e4c0465780a1ca623032b0bcd10a9317469905

# Diff at Tue, 04 Mar 2025 10:39:04 GMT:

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

