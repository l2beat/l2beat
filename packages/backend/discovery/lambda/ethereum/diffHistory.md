Generated with discovered.json: 0x11ad2fe16fdc0505518d5560b77a3be12667cecd

# Diff at Thu, 18 Jul 2024 10:31:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
      categories:
+        ["Core"]
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x0ab7f1a958bfb52aa19a321df6c754c25ec26cd0

# Diff at Mon, 17 Jun 2024 12:45:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20111587

## Description

Initial discovery:
Lambda Chain is an OP stack L2, publishing blobs to Ethereum. The TVL (USD ~3M) is almost exclusively in the associated token LAMB.
Lambda is developing decentralized modular storage services. EOA-upgradable.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054)
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7)
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8)
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F)
    +++ description: None
```
