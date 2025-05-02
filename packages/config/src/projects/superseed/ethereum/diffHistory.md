Generated with discovered.json: 0xd80ae96196a4158ce7db7659e00768963ebaf12a

# Diff at Tue, 29 Apr 2025 08:19:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22165377
- current block number: 22165377

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22165377 (main branch discovery), not current.

```diff
    contract AddressManager (0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract SuperchainConfig (0x118D04d841B54FC52e56D39371E278EF7815C358) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract OptimismPortal (0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xa9B074B27DE97f492F8F07fD7C213400E4ca5391","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract L2OutputOracle (0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract L1StandardBridge (0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

Generated with discovered.json: 0x6b8f47c6dd67058b5e18d28b4430bc59133b6bcf

# Diff at Mon, 31 Mar 2025 07:55:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22165377

## Description

Initial discovery: standard OP stack without proof system (conduit) and unused dispute game contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract AddressManager (0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x118D04d841B54FC52e56D39371E278EF7815C358)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD)
    +++ description: None
```
