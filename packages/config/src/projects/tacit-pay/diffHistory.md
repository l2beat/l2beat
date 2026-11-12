Generated with discovered.json: 0xd42410eda11ae39436bd26f9cdd0e76e0de3cf74

# Diff at Wed, 11 Nov 2026 10:05:27 GMT:

- id: da31b378
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e7f80c2eb530702e907f902d428416a31e27855 block: 1794215772
- current timestamp: 1794391460

## Description

The app owner starts a two-step handover of the app's steward role and of both registries to a Majeur DAO, which has not accepted yet. The registry's Ethereum history nodes drop Tenderly and add PublicNode.

## Watched changes

```diff
    contract TacitPay8244 (eth:0x0000000d42137547140b0812E1178F025e08bc49) [tacit-pay/TacitPay8244] {
    +++ description: One version of the anon.wei web app stored as contract code (ERC-8244). html() returns the page from immutable chunk contracts and checks it against PAGE_HASH. The steward can append one successor version, which latest() follows.
      values.pendingSteward:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x5E58BA0e06ED0F5558f83bE732a4b899a674053E"
    }
```

```diff
    contract zEndpoints (eth:0x00000051F365d898132f4ebF345Cd3968e02F288) [tacit-pay/zEndpoints] {
    +++ description: Owner-curated registry of service URLs per key and chain, which apps read at load to find their RPC nodes, relays and file mirrors.
+++ description: RPC nodes the anon.wei page asks first for Ethereum history.
      values.logNodesEthereum.0:
-        "https://mainnet.gateway.tenderly.co"
+++ description: RPC nodes the anon.wei page asks first for Ethereum history.
      values.logNodesEthereum.1:
-        "https://gateway.tenderly.co/public/mainnet"
+++ description: RPC nodes the anon.wei page asks first for Ethereum history.
      values.logNodesEthereum.1:
+        "https://ethereum-rpc.publicnode.com"
      values.pendingOwner:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x5E58BA0e06ED0F5558f83bE732a4b899a674053E"
    }
```

```diff
    contract zRpcList (eth:0x8C7348D039f58C4e9cfA936EF410eec759213b12) [tacit-pay/zRpcList] {
    +++ description: Owner-curated list of Ethereum RPC URLs that apps read at load.
      values.pendingOwner:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x5E58BA0e06ED0F5558f83bE732a4b899a674053E"
    }
```

```diff
+   Status: CREATED
    contract Shares (eth:0x00a6bA94BBb5474725515De88fE04F854f2dCb12) [majeur/Shares]
    +++ description: Voting token of a Majeur DAO with delegation and vote snapshots.
```

```diff
+   Status: CREATED
    contract Moloch (eth:0x5E58BA0e06ED0F5558f83bE732a4b899a674053E) [majeur/Moloch]
    +++ description: DAO of the Majeur framework. Holders of its shares vote on arbitrary calls, which the contract executes after the timelock. A proposal passes as soon as the quorum has voted with more votes for than against. Members can burn shares or loot for a pro-rata part of the treasury while ragequit is on.
```

## Source code changes

```diff
.../src/projects/tacit-pay/.flat/Moloch.sol        | 2050 ++++++++++++++++++++
 .../src/projects/tacit-pay/.flat/Shares.sol        | 2050 ++++++++++++++++++++
 2 files changed, 4100 insertions(+)
```

Generated with discovered.json: 0x8d659fb34b3dc4c0d1df99b4afaf63dd8686e55f

# Diff at Mon, 09 Nov 2026 11:16:30 GMT:

- id: f46f560c
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1794215772

## Description

Initial discovery of Tacit Pay on Ethereum: the ETH pool, its router, zap, Groth16 verifier, box implementation and Poseidon hasher, and the anon.wei page contract with the two registries the page reads its endpoints from.

## Initial discovery

```diff
+   Status: CREATED
    contract TacitPay8244 (eth:0x0000000d42137547140b0812E1178F025e08bc49) [tacit-pay/TacitPay8244]
    +++ description: One version of the anon.wei web app stored as contract code (ERC-8244). html() returns the page from immutable chunk contracts and checks it against PAGE_HASH. The steward can append one successor version, which latest() follows.
```

```diff
+   Status: CREATED
    contract zEndpoints (eth:0x00000051F365d898132f4ebF345Cd3968e02F288) [tacit-pay/zEndpoints]
    +++ description: Owner-curated registry of service URLs per key and chain, which apps read at load to find their RPC nodes, relays and file mirrors.
```

```diff
+   Status: CREATED
    contract TacitEvmPoolRouter (eth:0x0000006C96Afa6f1cD4DF8FE19bc0d8B6A6Cd7B5) [tacit-pay/TacitEvmPoolRouter]
    +++ description: Periphery of one pool. It derives deposit and receive boxes, addresses anyone can pay and anyone can sweep into the pool as notes the owner fixed in advance, and runs withdrawals that call other contracts in the same transaction.
```

```diff
+   Status: CREATED
    contract TacitEvmPoolZap (eth:0x0000008EbBF2323f95c4fBc18254f3D65C53998c) [tacit-pay/TacitEvmPoolZap]
    +++ description: Swaps the caller's token for ETH through zRouter and deposits it into the pool with the caller's proof, in one transaction. It holds nothing between transactions.
```

```diff
+   Status: CREATED
    contract TransactVerifier (eth:0x000000b1c0e84CEc8AdF8278B90c4d6400DfB153) [tacit-pay/TransactVerifier]
    +++ description: Groth16 verifier for the transact circuit, with the verification key of its trusted setup hard-coded.
```

```diff
+   Status: CREATED
    contract TacitEvmPool (eth:0x000000c2A20657CE25f2Ba99737933D031AFBEE9) [tacit-pay/TacitEvmPool]
    +++ description: Shielded pool for one asset. Each transaction carries one Groth16 proof that deposits, transfers inside the pool or withdraws, and inserts its new notes into a Poseidon tree the proof updates. It stores every root it has held and the spent nullifiers.
```

```diff
+   Status: CREATED
    EOA (eth:0x1C0Aa8cCD568d90d61659F060D1bFb1e6f855A20)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TacitBox (eth:0x4618B85d52F0d5b4a5540961F98b180b4313a0ea) [tacit-pay/TacitBox]
    +++ description: Implementation behind the router's boxes: clones at addresses fixed by each intent, which hold payments and release them only when the router instructs.
```

```diff
+   Status: CREATED
    contract PoseidonT5 (eth:0x555333f3f677Ca3930Bf7c56ffc75144c51D9767) [tacit-pay/PoseidonT5]
    +++ description: Four-input Poseidon hash from poseidon-solidity. The router computes the note of each receive box sweep with it.
```

```diff
+   Status: CREATED
    contract zRpcList (eth:0x8C7348D039f58C4e9cfA936EF410eec759213b12) [tacit-pay/zRpcList]
    +++ description: Owner-curated list of Ethereum RPC URLs that apps read at load.
```
