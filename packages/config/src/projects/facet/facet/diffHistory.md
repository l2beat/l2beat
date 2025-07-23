Generated with discovered.json: 0xd374e4c6063994dd11126e479bcc67676d34d9d4

# Diff at Wed, 23 Jul 2025 22:37:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 1622139

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
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2FFBBridge (0xB1f7976A7d4072c776D06A0c38ab6FbD85972FD4)
    +++ description: L2ERC20Bridge is an ERC20 minter counterpart to an L1 bridge. This contract is used to mint new ERC20 tokens on the L2 once a token deposit is made on the L1. Note that the token received on L2 could have a different ticker/symbol than the token sent on L1.
```
