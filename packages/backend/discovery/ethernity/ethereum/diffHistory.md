Generated with discovered.json: 0x8548d34d8a1fbb08c6c2da4fc0066684fd970276

# Diff at Wed, 08 Jan 2025 09:00:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21129680
- current block number: 21129680

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21129680 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xd38b72b316b50c6a6ae5cf75b0a9a9a0bef1d787

# Diff at Wed, 06 Nov 2024 16:04:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21129680

## Description

Standard OP stack Rollup with L2OutputOracle and FaultDisputeGame deployed in parallel (only L2OutputOracle used).

Also eoa admin. :()

0.99 debank l2 code similarity.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```
