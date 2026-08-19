Generated with discovered.json: 0x2674a26547988621f03ba2baf5414714aa360057

# Diff at Thu, 13 Aug 2026 14:48:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1786632517

## Description

Initial Starknet discovery of the strk20 privacy pool

## Initial discovery

```diff
+   Status: CREATED
    EOA Multisig 1 (strk:0x00d79041634625e5288296fbc648088788710ba44903a3a49468a66567749e77)
    +++ description: Multisig account contract on Starknet. Transactions must be approved by the configured threshold of signer keys before the account executes them.
```

```diff
+   Status: CREATED
    EOA Multisig 2 (strk:0x02796da10aba2e1f445c38eba07e5a4393d6dab30d203d3432deb824e891619a)
    +++ description: Multisig account contract on Starknet. Transactions must be approved by the configured threshold of signer keys before the account executes them.
```

```diff
+   Status: CREATED
    contract PrivacyPool (strk:0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a) [starknet/PrivacyPool]
    +++ description: STRK-20 privacy pool on Starknet. Users deposit tokens into private notes and transact them privately. Client-side proofs are verified by the sequencer, not on L1.
```

```diff
+   Status: CREATED
    EOA Multisig 3 (strk:0x0663cc699d9c51b7d4d434e06f5982692167546ce525d9155edb476ac9a117d6)
    +++ description: Multisig account contract on Starknet. Transactions must be approved by the configured threshold of signer keys before the account executes them.
```
