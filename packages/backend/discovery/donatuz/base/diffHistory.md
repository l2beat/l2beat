Generated with discovered.json: 0xbc1fec50c2e4f11b62634bf038a322e5d040ed64

# Diff at Sat, 18 Jan 2025 14:56:18 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 25206973

## Description

Initial discovery run

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x4A2b7478B9646c06C3517E6f06e1232684143C00)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
