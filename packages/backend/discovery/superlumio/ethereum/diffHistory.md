Generated with discovered.json: 0xda4b7623d6ddc3ef7d2036f75b8d77252ae778f1

# Diff at Wed, 18 Sep 2024 11:34:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20770354

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
