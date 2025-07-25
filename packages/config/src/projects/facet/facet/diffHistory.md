Generated with discovered.json: 0x9cb05744ea24eb39ee957f10f075ad3e9bb3f46e

# Diff at Fri, 25 Jul 2025 08:43:06 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 1632369

## Description

Bridge version discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: L2ToL1MessagePasser is a contract that allows messages to be sent from the L2 to the L1, used to send withdrawal requests from the L2 to the L1.
```

```diff
+   Status: CREATED
    contract L2WETHBridge (0x85e725E5b7E42f3377cB3A1Fdd8a5Ee6350d3850)
    +++ description: L2ERC20Bridge is an ERC20 minter counterpart to an L1 bridge. This contract is used to mint new ERC20 tokens on the L2 once a token deposit is made on the L1. Note that the token received on L2 could have a different ticker/symbol than the token sent on L1.
```
