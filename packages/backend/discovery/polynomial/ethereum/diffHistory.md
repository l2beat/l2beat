Generated with discovered.json: 0x6444c0db22e5d4f0a26cf92df3879302635a3d40

# Diff at Tue, 17 Sep 2024 08:30:22 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20763108

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x034cbb620d1e0e4C2E29845229bEAc57083b04eC)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x287bBa8116F2fc5a642bfD6027EBf5AD6522655C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x36725a5e0040deB7C697d46C0e24390702b202e0)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3Be64BF2b9C2dE637067C7AAb6baE5EDf9fEBA55)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x58b51fb9FeeD00DD846f91D265Eba3cdd855A413)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x994233366C8E11da5c525AB903c04e7AFB2915bD)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xD5890BBAFaFdce942597757385E55174569e8d1A)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xe512D477Cc89196AF2cE837f6AB8EA30e199f757)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
