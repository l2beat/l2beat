Generated with discovered.json: 0x91aa04e14352b9071acbd2fca8b095a4ea379f43

# Diff at Mon, 25 Nov 2024 14:24:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21265352

## Description

Standard opstack L2

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x00bd00c5C7F60e222D9CB8040270Ba929241A280)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x03eC1C43434E2f910A2fb984906cd2470fdb39c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7617f4a55d62b9EE49578D9C90593e58E607415F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x825C858149F1E775a0f4Aeb172037B970bE7B736)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xa74b7baF04867E62B7824268e96144E503A23666)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xD52ba64CBE1e3B44167f810622fBef36bE24d95c)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdbf381984c4515Fe3285D3C55fDfb3054C52c261)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xDf87154Ed6cF332931b70014bA3d9dF423074FfF)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```
