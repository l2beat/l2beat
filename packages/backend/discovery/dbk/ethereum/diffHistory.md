Generated with discovered.json: 0xbc06268c12c468be51fda6f9e97a9d06b2da844c

# Diff at Thu, 19 Sep 2024 10:41:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20784107

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450)
    +++ description: None
```
