Generated with discovered.json: 0xa7927bae9da68dea06fbe15a31cc98cb66459e71

# Diff at Tue, 15 Oct 2024 10:37:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20970413

## Description

Initial discovery: OP stack with old L2OutputOracle and unused, but deployed DisputeGame contracts. Two EOA admins: One for the USDC bridge, one for the Rollup.

## Initial discovery

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB)
    +++ description: Custom external escrow for USDC bridged to Worldchain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0x5891090d5085679714cb0e62f74950a3c19146a8)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract WorldchainMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf931a81D18B1766d15695ffc7c1920a62b7e710a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
