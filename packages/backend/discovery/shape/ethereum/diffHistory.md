Generated with discovered.json: 0x2bdd7db42436b16052a7763488380979b6e85e5c

# Diff at Tue, 29 Oct 2024 13:17:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21065298
- current block number: 21065298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x59f5c1563ea358ac473956b2ebb44a8a48245f23

# Diff at Mon, 28 Oct 2024 16:23:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21065298

## Description

Initial discovery: Standard OP stack rollup with EOA admin. (alchemy)

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09)
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
