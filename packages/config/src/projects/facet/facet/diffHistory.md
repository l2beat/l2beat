Generated with discovered.json: 0x4d37c193d5468f98a75add8a6ac62b91e7bf21c5

# Diff at Tue, 12 Aug 2025 12:08:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32a723ac08d08671a14307e26f7e27a0b92d39e7 block: 1754566470
- current timestamp: 1755000507

## Description

Silenced discovery.

## Watched changes

```diff
    contract L2Bridge (0x016bE6d77b783aBdDccaF3fea49ffa9c1CA660D4) {
    +++ description: L2Bridge is an ERC20 minter counterpart to an L1 bridge. This contract is used to mint new ERC20 tokens on the L2 once a token deposit is made on the L1. Note that the token received on L2 could have a different ticker/symbol than the token sent on L1.
      values.totalSupply:
-        1000000000000000
+        "52000000000000000"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: L2ToL1MessagePasser is a contract that allows messages to be sent from the L2 to the L1, used to send withdrawal requests from the L2 to the L1.
      values.messageNonce:
-        "1766847064778384329583297500742918515827483896875618958121606201292619931"
+        "1766847064778384329583297500742918515827483896875618958121606201292619932"
    }
```

Generated with discovered.json: 0xca546f7391c1b283064ce820a034d0aabfe882cb

# Diff at Thu, 07 Aug 2025 11:34:38 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1754566470

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L2Bridge (0x016bE6d77b783aBdDccaF3fea49ffa9c1CA660D4)
    +++ description: L2Bridge is an ERC20 minter counterpart to an L1 bridge. This contract is used to mint new ERC20 tokens on the L2 once a token deposit is made on the L1. Note that the token received on L2 could have a different ticker/symbol than the token sent on L1.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: L2ToL1MessagePasser is a contract that allows messages to be sent from the L2 to the L1, used to send withdrawal requests from the L2 to the L1.
```
