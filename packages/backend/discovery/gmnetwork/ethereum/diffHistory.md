Generated with discovered.json: 0x5a8b4b3276f73ea8f15defaf1ba19c122454c46f

# Diff at Tue, 19 Nov 2024 15:24:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21222656

## Description

OP stack in alt-DA mode, not using EigenDA currently (judging from the DA-service byte in the tx data commitments). Thus BasementDA with DA challenges. Challenges must be respected in the L2 node's derivation rule, which is not clear here, but we assume they use the standard node like xterio, redstone, cyber.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828)
    +++ description: None
```
