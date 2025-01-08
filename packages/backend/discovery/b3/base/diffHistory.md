Generated with discovered.json: 0xac16c30325f14d654a8a439e24d060f4e952970c

# Diff at Wed, 08 Jan 2025 09:09:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x16cf8ae6def6f97184452fbcca60b2364c9d6b8a

# Diff at Tue, 03 Dec 2024 15:03:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 23224422

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
