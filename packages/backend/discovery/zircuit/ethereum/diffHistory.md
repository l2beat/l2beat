Generated with discovered.json: 0xa87cd2a83ac938e7e57e7e3f83cdfa45e40f27f9

# Diff at Fri, 09 Aug 2024 11:46:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 20490461

## Description

Initial discovery: Fork from the latest pre-FP OP stack contracts with added ZK proofs.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932)
    +++ description: None
```
