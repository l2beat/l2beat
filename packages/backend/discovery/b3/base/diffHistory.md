Generated with discovered.json: 0x754b548df252478896dd5c5013f62524d16d8b7f

# Diff at Thu, 28 Nov 2024 15:02:25 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 23008392

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
    contract GnosisSafeL2 (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x1DA898D47E057Bc9Af0a5709F20acbfF900bDe60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x2304CB33d95999dC29f4CeF1e35065e670a70050)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x28EDB11394eb271212ED66c08f2b7893C04C5D65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract  (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38)
    +++ description: None
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
    contract  (0xadA565Abc1Fe7358259c22dd0A7372229d943388)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xd94E416cf2c7167608B2515B7e4102B41efff94f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
