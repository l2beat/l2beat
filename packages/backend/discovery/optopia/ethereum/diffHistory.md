Generated with discovered.json: 0x207f322d908c7a5b5b1951e19c4120f60fa25e00

# Diff at Wed, 31 Jul 2024 15:12:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20427351

## Description

Initial discovery: OP stack rollup with superchain fork.

## Initial discovery

```diff
+   Status: CREATED
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C)
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
