Generated with discovered.json: 0x2e4c42d8030611501efdf434da6bf57ed108d469

# Diff at Thu, 07 Aug 2025 10:33:32 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1754562805

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
