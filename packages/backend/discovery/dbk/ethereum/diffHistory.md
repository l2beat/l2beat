Generated with discovered.json: 0x473bb768f1aa300c0dd6def36ec96e6a53937528

# Diff at Fri, 20 Sep 2024 14:13:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c1f8c9b7beabeba1a847fb9e1064a356593cfe16 block: 20790352
- current block number: 20792021

## Description

Ignored value.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20790352 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.balance:
-        "273731965608868189754"
    }
```

Generated with discovered.json: 0xeec51188f25afd9660ac5c21ff0644557b3829ab

# Diff at Fri, 20 Sep 2024 07:37:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20790352

## Description

Initial discovery of a highly custom OP stack deployment: Beta version of Systemconfig with gas token support (not used) and a deployed dispute game factory without support for it in the OptimismPortal (and an active legacy L2OutputOracle).

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
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
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
