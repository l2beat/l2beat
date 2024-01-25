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
