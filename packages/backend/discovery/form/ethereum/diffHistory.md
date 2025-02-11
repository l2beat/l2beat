Generated with discovered.json: 0x949d20b5cc0bd151228a622a97c0bfb7cd7cc8c9

# Diff at Fri, 07 Feb 2025 13:55:52 GMT:

- author: Marouane Trabelsi (<marouane.trab@gmail.com>)
- current block number: 21795065

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x0d3BCBe63Ee8D286a4015aFA2c7FaA0B2f48067b)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AddressManager (0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x453974F09B192684F57D4Ce1DDb642171E439357)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x4ccAAF69F41c5810cA875183648B577CaCf1F67E)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x4E259Ee5F4136408908160dD32295A5031Fa426F)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6161C14A37Bc428401A011E5941330cD169a0255)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x65f0819c647E06C3191a8b2dd59031259746FB4F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdc20aA63D3DE59574E065957190D8f24e0F7B8Ba)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
