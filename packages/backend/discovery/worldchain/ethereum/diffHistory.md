Generated with discovered.json: 0xc086d10bc2e97164cd3bcc76f3c7fcdf70428204

# Diff at Fri, 18 Oct 2024 21:53:59 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa3c4b99c222d26df7f985211771efce84cdc134 block: 20986974
- current block number: 20995261

## Description

Discovery refresh, multisig updated.

## Watched changes

```diff
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract AddressManager (0x5891090d5085679714cb0e62f74950a3c19146a8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract WorldchainMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      values.$members.5:
+        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      values.$members.4:
+        "0x39CF304731099e756204219BF0a8cCc4738dE9dD"
      values.$members.3:
+        "0x3f0030b9Ca695Abd41b2B619F3298e172e4FCAD6"
      values.$members.2:
+        "0x2e42cEfC761e64Bf4442694220d31C2464a6EE21"
      values.$members.1:
+        "0x5EABE7f6673311EdD1Ad17A76ce148c2Bb56aF01"
      values.$members.0:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xaCEF7482b54a57F50b1CD8c99d1dC1964202A063"
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "3 of 6 (50%)"
      receivedPermissions:
+        [{"permission":"configure","target":"0x5891090d5085679714cb0e62f74950a3c19146a8","description":"set and change address mappings.","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x19A6d1E9034596196295CF148509796978343c5D","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x470458C91978D2d929704489Ad730DC3E3001113","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x82Cb528466cF22412d89bdBE9bCF04856790dD0e","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0xa231f8be37e583f276f93dF516D88a043bfe47E3","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]}]
    }
```

```diff
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

Generated with discovered.json: 0xb7286d1c7f3af58d9fea1dbc040336779a05b583

# Diff at Thu, 17 Oct 2024 18:07:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20986974

## Description

Initial discovery: OP stack with old L2OutputOracle and unused, but deployed DisputeGame contracts. Two EOA admins: One for the USDC bridge, one for the Rollup.

## Initial discovery

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB)
    +++ description: Custom external escrow for USDC bridged to Worldchain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0x5891090d5085679714cb0e62f74950a3c19146a8)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3)
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract WorldchainMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf931a81D18B1766d15695ffc7c1920a62b7e710a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
