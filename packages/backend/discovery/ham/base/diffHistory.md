Generated with discovered.json: 0xbcca76541a33854ae204ea185259f349ada3ba34

# Diff at Wed, 31 Jul 2024 16:42:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 17827379

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA)
    +++ description: It can act on behalf of 0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49, inheriting its permissions.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
