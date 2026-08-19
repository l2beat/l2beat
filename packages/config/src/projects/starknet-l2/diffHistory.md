Generated with discovered.json: 0x085cf1ae13842f6991e2565e996db10800c79b5a

# Diff at Thu, 13 Aug 2026 14:48:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1786632511

## Description

Initial Starknet L2 discovery of the Starkgate bridges

## Initial discovery

```diff
+   Status: CREATED
    contract StarkGateWrappedStakedEther (strk:0x0057912720381af14b0e5c87aa4718ed5e527eab60b3801ebf702ab09139e38b) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXBridge (strk:0x006646a87b8e9e51a893c52facd89f99539a152b96e72daee6a7a3734aa5299a) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract rETHBridge (strk:0x0078da8023b3c08e5a41540a34f7c385fd4f4540d5668f1be3ede0d3bb1b9d4d) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract wstETHBridge (strk:0x0088eedbe2fe3918b69ccb411713b7fa72079d4eddf291103ccbe41e78a9615c) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    EOA Multisig 1 (strk:0x00eaeaded2fdf232bda77a2db0adea38b222a67559a7ec93bb446fc0759d2df0)
    +++ description: Multisig account contract on Starknet. Transactions must be approved by the configured threshold of signer keys before the account executes them.
```

```diff
+   Status: CREATED
    contract RealmsLORDSToken (strk:0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract LBTCBridge (strk:0x0239eee60e6d0bed42315ac74a1fc43db8074646d4d2a0a9e6fa5272685a0eb5) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    EOA  (strk:0x03103066e6c7037ba947ea9a7b5b8d110ae7f3d631fa5849435d0dc1fc5ef785)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SolvBTCBridge (strk:0x032c68653622292bedf0ed6d941888a01d3923c7f4eb633a0c08c5497a1f5f58) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    EOA  (strk:0x0399eb3460eb885b5e1f5f2aebf63dadb7493f4cbf34868434366bbb55422c4e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StarkGateLegacyStarknetWrappedStakedEther (strk:0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (strk:0x045653a585ec600d7f050279376d353f84c7d6d09cf225aefbcb83bfaf4abb07)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (strk:0x04758595201d9d01be9f8bd232fe3a1c0b5c7b953219c9faa35779b3e73c214c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UNIBridge (strk:0x04fe90c0c4594b4a5ce3031a4bbdfbc7c046b4b9d7cf31b79647540c85b8ec79) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    EOA  (strk:0x05184d0ca467011a1eeff75043eb79835b05ad46b752ece284e8838aea5bab29)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LUSDBridge (strk:0x05841ed9b790719b61dc98826246a7a3012dd35b0ed728e3c455af2647385c80) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract STRKBridge (strk:0x0594c1582459ea03f77deaf9eb7e3917d6994a03c13405ba42867f83d85f085d) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract USDCBridge (strk:0x05cd48fccbfd8aa2773fe22c217e808319ffcc1c5a6a463f7d8fa2da48218196) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract MultiBridge (strk:0x0616757a151c21f9be8775098d591c2807316d992bbc3bb1a5c1821630589256) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract FXSBridge (strk:0x06bf25c0911c6c63abfe3600428144d0d0dbf8b7bfbc44306a3386aa95a24296) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract sfrxETHBridge (strk:0x06dcc61c4cf056ff42a8f4b8635c207e3da73332282aa2132058022520fa0179) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract ETHBridge (strk:0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    EOA Multisig 2 (strk:0x073b4e1fcfbdd38286307c498256fd23fb1f1e008d3ef17c5ab248bb8d2dd0a3)
    +++ description: Multisig account contract on Starknet. Transactions must be approved by the configured threshold of signer keys before the account executes them.
```

```diff
+   Status: CREATED
    contract USDTBridge (strk:0x074761a8d48ce002963002becc6d9c3dd8a2a05b1075d55e5967f42296f16bd0) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract WBTCBridge (strk:0x07aeec4870975311a7396069033796b61cd66ed49d22a786cba12a8d76717302) [starknet/StarkgateTokenBridge]
    +++ description: Starkgate token bridge on Starknet (L2 side). Mints the L2 token on deposits and burns it on withdrawals, relayed through the Starknet core messaging contract on Ethereum.
```

```diff
+   Status: CREATED
    contract BridgeExecutor (strk:0x07ba4bb6a9ec398598c9c08424af6bdb83f56e78ffc8f07f0da0dfae8deca432) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract LORDSBridge (strk:0x07c76a71952ce3acd1f953fd2a3fda8564408b821ff367041c89f44526076633) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (strk:0x07cb6648d32504bc4d6073f1e5fd9021a15f6963776a8dbe0d9e2f744743fb40)
    +++ description: None
```
