Generated with discovered.json: 0x19c77f19ac44816dab32be8792c834066d7b7a40

# Diff at Fri, 20 Jun 2025 13:52:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 22746105

## Description

First discovery, all templatized.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa446331bD28cbe0186A983a27C528f566B6bedE0)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xF005dFb08377faD44588Af68d0884D272A6fb050)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
