Generated with discovered.json: 0xf403cc7f6e4417f0cf53bf159056fb905ed9ab0e

# Diff at Thu, 09 Jan 2025 10:11:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21586240

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract MIPS (0x99F4f5651FF808107A84F279ed8b79e0870F1f39)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xB6846927447e4764acd53b0b354BEd939f9220d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xE7Fd68F6a389DE7D7C9cFCfCE15486885abeDD44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe805B5dD6487f1528CCb204d76d007cB4699aEF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xF27d54dB0587442b01d6036C0F7f67CDaaBa1743)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```
