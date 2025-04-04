Generated with discovered.json: 0x605763006a0f1065b16ec3e6bbbf961f5c924bba

# Diff at Fri, 04 Apr 2025 10:09:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22194762

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x8F56a665c376A08b604DD32ee6E88667A6093172)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```
